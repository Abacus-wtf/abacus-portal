import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { getContract } from "@config/utils"
import { ABC_PRICING_SESSION_ADDRESS } from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import { useGeneralizedContractCall, ReloadDataType } from "./"
import { useActiveWeb3React } from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"
import { useCurrentSessionData } from "@state/sessionData/hooks"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const useOnCreateNewSession = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPool
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onCreateNewSession = useCallback(
    async (nftAddress: string, tokenId: string, initAppraisal: string, votingTime: number, cb: () => void, bounty?: string) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS(networkSymbol),
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.createNewSession
      estimate = pricingSessionContract.estimateGas.createNewSession
      args = [
        nftAddress,
        tokenId,
        parseEther(initAppraisal),
        votingTime
      ]
      value = bounty ? parseEther(bounty) : null
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Create New Session",
        })
        await response.wait()
        cb()
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [account, library, sessionData, networkSymbol]
  )
  return {
    onCreateNewSession,
    isPending,
  }
}