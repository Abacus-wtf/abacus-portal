import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { getContract } from "@config/utils"
import {
  ABC_PRICING_SESSION_ADDRESS,
  ARB_ABC_PRICING_SESSION_ADDRESS_LEGACY,
} from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import {
  useActiveWeb3React,
  useGeneralizedContractCall,
  ReloadDataType,
  useWeb3Contract,
} from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const useOnClaimPayout = (isLegacy = false) => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPool
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)

  const onClaim = useCallback(
    async (isEth: boolean, amount: string) => {
      let estimate
      let method: (...args: any) => Promise<TransactionResponse>
      let args: Array<BigNumber | number | string>
      let value: BigNumber | null

      const pricingSessionContract = getContract(
        isLegacy
          ? ARB_ABC_PRICING_SESSION_ADDRESS_LEGACY
          : ABC_PRICING_SESSION_ADDRESS(networkSymbol),
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )

      const pricingSessionRead = getPricingSessionContract(
        ABC_PRICING_SESSION_ADDRESS(networkSymbol)
      )

      const ethToAbc = await pricingSessionRead.methods.ethToAbc().call()
      method = pricingSessionContract.claimProfitsEarned
      estimate = pricingSessionContract.estimateGas.claimProfitsEarned
      if (isEth) {
        args = [1, parseEther(amount)]
      } else {
        args = [2, parseEther(`${Number(amount) / Number(ethToAbc)}`)]
      }
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
    [
      isLegacy,
      networkSymbol,
      library,
      account,
      getPricingSessionContract,
      generalizedContractCall,
      addTransaction,
    ]
  )
  return {
    onClaim,
    isPending,
  }
}

export const useOnClaimPrincipalAmount = (isLegacy = false) => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPool
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onClaimPrincipal = useCallback(
    async (amount: string) => {
      let estimate
      let method: (...args: any) => Promise<TransactionResponse>
      let args: Array<BigNumber | number | string>
      let value: BigNumber | null

      const pricingSessionContract = getContract(
        isLegacy
          ? ARB_ABC_PRICING_SESSION_ADDRESS_LEGACY
          : ABC_PRICING_SESSION_ADDRESS(networkSymbol),
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.claimPrincipalUsed
      estimate = pricingSessionContract.estimateGas.claimPrincipalUsed
      args = [parseEther(amount)]
      value = null
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Claim Principal Amount",
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
    [
      isLegacy,
      networkSymbol,
      library,
      account,
      generalizedContractCall,
      addTransaction,
    ]
  )
  return {
    onClaimPrincipal,
    isPending,
  }
}

export const useOnDepositPrincipal = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPool
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onDeposit = useCallback(
    async (amount: string) => {
      let estimate
      let method: (...args: any) => Promise<TransactionResponse>
      let args: Array<BigNumber | number | string>
      let value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS(networkSymbol),
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.depositPrincipal
      estimate = pricingSessionContract.estimateGas.depositPrincipal
      args = []
      value = parseEther(amount)
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Deposit Principal",
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
    [networkSymbol, library, account, generalizedContractCall, addTransaction]
  )
  return {
    onDeposit,
    isPending,
  }
}
