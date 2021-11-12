import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core"
import { Web3ReactContextInterface } from "@web3-react/core/dist/types"
import { NetworkContextName } from "@config/constants"
import { useCallback, useEffect, useRef, useState } from "react"
import { web3, web3Eth } from "@config/constants"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { calculateGasMargin } from "@config/utils"
import { useToggleWalletModal, useGetCurrentNetwork } from "@state/application/hooks"
import {
  useCurrentSessionData,
  useGetCurrentSessionData,
} from "@state/sessionData/hooks"
import { useSetAuctionData, useSetPayoutData } from "@state/miscData/hooks"

export enum ReloadDataType {
  Auction,
  Session,
  ClaimPool
}

export function usePrevious<Type>(value: Type) {
  const ref = useRef<Type>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export function useActiveWeb3React(): Web3ReactContextInterface<
  Web3Provider
> & { chainId?: number } {
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
      } else {
        getCurrentSessionData(address, tokenId, nonce)
      }
    }
  }, [previousIsPending, isPending, sessionData, getCurrentSessionData])

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
        .then(estimatedGasLimit =>
          method(...args, {
            ...(value ? { value } : {}),
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }).then(async response => {
            setIsPending(true)
            cb(response)
            await response.wait()
            setIsPending(false)
          })
        )
        .catch(error => {
          console.error(error)
        })
    },
    [account, chainId, library]
  )

  return {
    generalizedContractCall,
    isPending,
  }
}
