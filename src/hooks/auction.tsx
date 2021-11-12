import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { getContract, openseaGet } from "@config/utils"
import { ABC_AUCTION_ADDRESS } from "@config/constants"
import ABC_AUCTION_ABI from "@config/contracts/ABC_AUCTION_ABI.json"
import { ReloadDataType, useGeneralizedContractCall } from "./"
import { useActiveWeb3React } from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"
import { sendDiscordMessage } from "utils/discord"
import { DISCORD_WEBHOOK_URL } from "@config/constants"
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
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

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
        await response.wait()
        setTimeout(async () => {
          const meta = await openseaGet(`asset/${nftAddress}/${tokenId}`)
          await sendDiscordMessage({
            webhookUrl: DISCORD_WEBHOOK_URL.NEW_BID,
            message: `<------------->\nNew bid sent by ${account} !\nBid amount: ${bid} ETH\nNFT Link: ${nftAddress}\nToken ID: ${tokenId}\nOpenSea Link: ${meta?.permalink}\nImage: ${meta?.image_url}`,
          })
        }, 3000)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [account, library, networkSymbol]
  )
  return {
    onBid,
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
    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<BigNumber | number | string>,
      value: BigNumber | null

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
  }, [account, library, networkSymbol])
  return {
    onClaim,
    isPending,
  }
}
