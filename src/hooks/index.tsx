import React, { useCallback, useEffect, useRef, useState } from "react"
import { Web3Provider, TransactionResponse } from "@ethersproject/providers"
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core"
import { Web3ReactContextInterface } from "@web3-react/core/dist/types"
import {
  IS_PRODUCTION,
  NetworkContextName,
  NetworkSymbolEnum,
  web3,
  web3Eth,
} from "@config/constants"
import { BigNumber } from "ethers"
import { calculateGasMargin } from "@config/utils"
import {
  useToggleWalletModal,
  useGetCurrentNetwork,
} from "@state/application/hooks"
import {
  useCurrentSessionData,
  useGetCurrentSessionData,
} from "@state/sessionData/hooks"
import { useSetAuctionData, useSetPayoutData } from "@state/miscData/hooks"
import { useDispatch } from "react-redux"
import { setGeneralizedContractErrorMessage } from "@state/application/actions"
import styled from "styled-components"
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall"
import _ from "lodash"

const ErrorMessageLabel = styled.label`
  font-size: 1.4rem;
  font-weight: bold;
  margin-left: 2px;
`

export enum ReloadDataType {
  Auction,
  Session,
  ClaimPool,
  ClaimPoolAndSession,
}

const ETHERSCAN_PREFIXES: { [chainId in number]: string } = {
  1: "etherscan.io",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
  137: "polygonscan.com",
  42161: "arbiscan.io",
  421611: "testnet.arbiscan.io",
  80001: "mumbai",
}

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: "transaction" | "token" | "address" | "block"
): string {
  const prefix = chainId
    ? `https://${ETHERSCAN_PREFIXES[chainId]}`
    : `https://${ETHERSCAN_PREFIXES[42161]}`

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`
    }
    case "token": {
      return `${prefix}/token/${data}`
    }
    case "block": {
      return `${prefix}/block/${data}`
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function usePrevious<Type>(value: Type) {
  const ref = useRef<Type>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId?: number
} {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useMultiCall(abi: any) {
  const { chainId } = useActiveWeb3React()
  let networkSymbol = useGetCurrentNetwork()
  if (networkSymbol === NetworkSymbolEnum.NONE) {
    networkSymbol = NetworkSymbolEnum.ARBITRUM
  }

  return useCallback(
    async (contractAddress: string, methods: string[], args: any[][]) => {
      let multicall: any
      if (chainId === 421611 || (!IS_PRODUCTION && chainId === undefined)) {
        multicall = new Multicall({
          multicallCustomContractAddress:
            "0x977923a4097cd0c21b272c0644d18b57d3676b8f",
          web3Instance: web3(networkSymbol),
          tryAggregate: false,
        })
      } else {
        multicall = new Multicall({
          web3Instance: web3(networkSymbol),
          tryAggregate: false,
        })
      }

      const context: ContractCallContext[] = _.map(
        _.range(0, methods.length),
        (index) => ({
          reference: methods[index],
          contractAddress,
          abi,
          calls: [
            {
              reference: methods[index],
              methodName: methods[index],
              methodParameters: args[index],
            },
          ],
        })
      )
      const resultsMulticall: ContractCallResults = await multicall.call(
        context
      )
      const resultsData = resultsMulticall.results
      return _.map(
        Object.keys(resultsData),
        (method) => resultsData[method].callsReturnContext[0].returnValues
      )
    },
    [abi, networkSymbol, chainId]
  )
}

export function useWeb3Contract(ABI: any) {
  let networkSymbol = useGetCurrentNetwork()
  if (networkSymbol === NetworkSymbolEnum.NONE) {
    networkSymbol = NetworkSymbolEnum.ARBITRUM
  }
  return useCallback(
    (address: string) => {
      const Web3 = web3(networkSymbol)
      const contract = new Web3.eth.Contract(ABI, address)
      return contract
    },
    [ABI, networkSymbol]
  )
}

export function useWeb3EthContract(ABI: any) {
  return useCallback(
    (address: string) => {
      const contract = new web3Eth.eth.Contract(ABI, address)
      return contract
    },
    [ABI]
  )
}

export const useGeneralizedContractCall = (reloadType?: ReloadDataType) => {
  const sessionData = useCurrentSessionData()
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useToggleWalletModal()
  const dispatch = useDispatch()

  const getCurrentSessionData = useGetCurrentSessionData()
  const setPayoutData = useSetPayoutData()
  const setAuctionData = useSetAuctionData()
  const [isPending, setIsPending] = useState(false)
  const previousIsPending = usePrevious(isPending)

  useEffect(() => {
    const { address, tokenId, nonce } = sessionData
    if (previousIsPending && !isPending) {
      // re-fetch state
      if (reloadType === ReloadDataType.Auction) {
        setAuctionData()
      } else if (reloadType === ReloadDataType.ClaimPool) {
        setPayoutData(account)
      } else if (reloadType === ReloadDataType.ClaimPoolAndSession) {
        setPayoutData(account)
        getCurrentSessionData(address, tokenId, nonce)
      } else {
        getCurrentSessionData(address, tokenId, nonce)
      }
    }
  }, [
    previousIsPending,
    isPending,
    sessionData,
    getCurrentSessionData,
    reloadType,
    setAuctionData,
    setPayoutData,
    account,
  ])

  const generalizedContractCall = useCallback(
    async ({
      estimate,
      method,
      args,
      value,
      cb,
    }: {
      estimate: any
      method: (...args: any) => Promise<TransactionResponse>
      args: Array<BigNumber | number | string>
      value: BigNumber | null
      cb: (response: any) => void
    }) => {
      dispatch(setGeneralizedContractErrorMessage(null))
      if (account === undefined || account === null) {
        toggleWalletModal()
        alert(
          "Error processing your request, please login to an Ethereum Wallet provider."
        )
        return
      }

      if (!library || !chainId) {
        toggleWalletModal()
        alert(
          "Please login to an Ethereum Wallet provider to move on to the next step."
        )
        return
      }
      await estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }).then(async (response) => {
            setIsPending(true)
            await response.wait()
            cb(response)
            setIsPending(false)
          })
        )
        .catch((error) => {
          if (error?.code === -32603) {
            const ErrorMessage = (
              <>
                <ErrorMessageLabel>
                  The transaction was reverted.
                </ErrorMessageLabel>
                <div style={{ marginLeft: 42 }}>
                  <p style={{ marginTop: 10 }}>
                    You may not have enough ABC or ETH to complete this
                    transaction.
                  </p>{" "}
                  {error?.data?.message ? (
                    <p style={{ marginTop: 5 }}>
                      The error message from MetaMask was: "
                      <i>{error.data.message}</i>"
                    </p>
                  ) : null}
                </div>
              </>
            )

            dispatch(setGeneralizedContractErrorMessage(ErrorMessage))
          }
          console.error(error)
        })
    },
    [account, chainId, dispatch, library, toggleWalletModal]
  )

  return {
    generalizedContractCall,
    isPending,
  }
}
