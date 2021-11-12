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

export const useOnClaimPayout = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPool
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onClaim = useCallback(
    async (isEth: boolean, amount: string) => {
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
      method = pricingSessionContract.claimProfitsEarned
      estimate = pricingSessionContract.estimateGas.claimProfitsEarned
      args = [
        isEth ? 1 : 2,
        parseEther(amount)
      ]
      value = null
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Claim Payout",
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
    [account, library, sessionData, networkSymbol]
  )
  return {
    onClaim,
    isPending,
  }
}