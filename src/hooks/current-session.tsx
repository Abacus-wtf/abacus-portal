import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { getContract } from "@config/utils"
import { ABC_PRICING_SESSION_ADDRESS } from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import { useGeneralizedContractCall } from "./"
import { useActiveWeb3React } from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"

export const useOnSubmitVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (hash: string, stake: string, cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.setVote
      estimate = pricingSessionContract.estimateGas.setVote
      args = [sessionData.address, Number(sessionData.tokenId), hash]
      value = parseEther(stake)
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Submit Vote",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}

export const useOnUpdateVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (hash: string, cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.updateVote
      estimate = pricingSessionContract.estimateGas.updateVote
      args = [sessionData.address, Number(sessionData.tokenId), hash]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Update Vote",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}

export const useOnWeightVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (
      appraisalValue: string,
      seed: string,
      cb: (hash: string) => void
    ) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.weightVote
      estimate = pricingSessionContract.estimateGas.weightVote
      args = [
        sessionData.address,
        Number(sessionData.tokenId),
        appraisalValue,
        seed,
      ]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Weight Vote",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}

export const useOnSetFinalAppraisal = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.setFinalAppraisal
      estimate = pricingSessionContract.estimateGas.setFinalAppraisal
      args = [sessionData.address, Number(sessionData.tokenId)]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Set Final Appraisal",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}

export const useOnHarvest = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.harvest
      estimate = pricingSessionContract.estimateGas.harvest
      args = [sessionData.address, Number(sessionData.tokenId)]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Harvest",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}

export const useOnClaim = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (isClaimingEth: boolean, cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.harvest
      estimate = pricingSessionContract.estimateGas.harvest
      args = [
        isClaimingEth ? 1 : 2,
        sessionData.address,
        Number(sessionData.tokenId),
      ]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "Claim Tokens",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}

export const useOnEndSession = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(
    async (cb: (hash: string) => void) => {
      let estimate,
        method: (...args: any) => Promise<TransactionResponse>,
        args: Array<BigNumber | number | string>,
        value: BigNumber | null

      const pricingSessionContract = getContract(
        ABC_PRICING_SESSION_ADDRESS,
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.endSession
      estimate = pricingSessionContract.estimateGas.endSession
      args = [sessionData.address, Number(sessionData.tokenId)]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: "End Session",
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        // @ts-ignore
        txnCb,
      })
    },
    [account, library, sessionData]
  )
}
