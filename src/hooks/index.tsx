import { Web3Provider, TransactionResponse } from "@ethersproject/providers"
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core"
import { Web3ReactContextInterface } from "@web3-react/core/dist/types"
import { NetworkContextName, web3, web3Eth } from "@config/constants"
import { useCallback, useEffect, useRef, useState } from "react"
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
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId]}`

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

export function useWeb3Contract(ABI: any) {
  const networkSymbol = useGetCurrentNetwork()
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
          console.error(error)
        })
    },
    [account, chainId, library, toggleWalletModal]
  )

  return {
    generalizedContractCall,
    isPending,
  }
}
