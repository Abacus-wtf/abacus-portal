import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { getContract } from "@config/utils"
import { ABC_AUCTION_ADDRESS } from "@config/constants"
import ABC_AUCTION_ABI from "@config/contracts/ABC_AUCTION_ABI.json"
import { useGeneralizedContractCall } from "./"
import { useActiveWeb3React } from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"

export const useOnBid = () => {
  const { account, library } = useActiveWeb3React()
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (bid: string, initAppraisal: string, nftAddress: string, tokenId: string, cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const auctionContract = getContract(
        ABC_AUCTION_ADDRESS,
        ABC_AUCTION_ABI,
        library,
        account
      )
      method = auctionContract.newBid
      estimate = auctionContract.estimateGas.newBid
      args = [
        nftAddress,
        tokenId,
        parseEther(initAppraisal),
      ]
      value = parseEther(bid)
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Bid Action",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [account, library]
  )
}