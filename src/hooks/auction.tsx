import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { getContract } from "@config/utils"
import { ABC_AUCTION_ADDRESS } from "@config/constants"
import ABC_AUCTION_ABI from "@config/contracts/ABC_AUCTION_ABI.json"
import {
  useActiveWeb3React,
  ReloadDataType,
  useGeneralizedContractCall,
} from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const useOnBid = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.Auction
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onBid = useCallback(
    async (
      bid: string,
      initAppraisal: string,
      nftAddress: string,
      tokenId: string
    ) => {
      let estimate
      let method: (...args: any) => Promise<TransactionResponse>
      let args: Array<BigNumber | number | string>
      let value: BigNumber | null

      const auctionContract = getContract(
        ABC_AUCTION_ADDRESS(networkSymbol),
        ABC_AUCTION_ABI,
        library,
        account
      )
      method = auctionContract.newBid
      estimate = auctionContract.estimateGas.newBid
      args = [nftAddress, tokenId, parseEther(initAppraisal)]
      value = parseEther(bid)
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Bid Action",
        })
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [account, addTransaction, generalizedContractCall, library, networkSymbol]
  )
  return {
    onBid,
    isPending,
  }
}

export const useOnAddToBid = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.Auction
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onAddToBid = useCallback(
    async (bid: string) => {
      let estimate
      let method: (...args: any) => Promise<TransactionResponse>
      let args: Array<BigNumber | number | string>
      let value: BigNumber | null

      const auctionContract = getContract(
        ABC_AUCTION_ADDRESS(networkSymbol),
        ABC_AUCTION_ABI,
        library,
        account
      )
      method = auctionContract.addToBid
      estimate = auctionContract.estimateGas.addToBid
      args = []
      value = parseEther(bid)
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Add To Bid Action",
        })
        await response.wait()
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [account, addTransaction, generalizedContractCall, library, networkSymbol]
  )
  return {
    onAddToBid,
    isPending,
  }
}

export const useOnClaim = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.Auction
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onClaim = useCallback(async () => {
    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<BigNumber | number | string>
    let value: BigNumber | null

    const auctionContract = getContract(
      ABC_AUCTION_ADDRESS(networkSymbol),
      ABC_AUCTION_ABI,
      library,
      account
    )
    method = auctionContract.claim
    estimate = auctionContract.estimateGas.claim
    args = []
    value = null
    const txnCb = async (response: any) => {
      addTransaction(response, {
        summary: "Claim Action",
      })
    }
    await generalizedContractCall({
      method,
      estimate,
      args,
      value,
      cb: txnCb,
    })
  }, [account, addTransaction, generalizedContractCall, library, networkSymbol])
  return {
    onClaim,
    isPending,
  }
}
