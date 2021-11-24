import { useCallback } from "react"
import { parseEther } from "ethers/lib/utils"
import { getContract } from "@config/utils"
import { ABC_PRICING_SESSION_ADDRESS } from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import {
  useActiveWeb3React,
  useGeneralizedContractCall,
  ReloadDataType,
} from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const useOnCreateNewSession = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPool
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onCreateNewSession = useCallback(
    async (
      nftAddress: string,
      tokenId: string,
      initAppraisal: string,
      votingTime: number,
      cb: () => void,
      bounty?: string
    ) => {
      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS(networkSymbol),
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      const method = pricingSessionContract.createNewSession
      const estimate = pricingSessionContract.estimateGas.createNewSession
      const args = [nftAddress, tokenId, parseEther(initAppraisal), votingTime]
      const value = bounty ? parseEther(bounty) : null
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
    [networkSymbol, library, account, generalizedContractCall, addTransaction]
  )
  return {
    onCreateNewSession,
    isPending,
  }
}
