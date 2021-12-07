import { useCallback } from "react"
import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/providers"
import { parseEther } from "ethers/lib/utils"
import { getContract } from "@config/utils"
import { ABC_PRICING_SESSION_ADDRESS } from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import {
  ReloadDataType,
  useActiveWeb3React,
  useGeneralizedContractCall,
} from "@hooks/index"
import { useTransactionAdder } from "@state/transactions/hooks"
import { useCurrentSessionData } from "@state/sessionData/hooks"
import { useGetCurrentNetwork } from "@state/application/hooks"

export const useOnAddToStake = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPoolAndSession
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onAddToStake = useCallback(
    async (amount: string) => {
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
      method = pricingSessionContract.addToStake
      estimate = pricingSessionContract.estimateGas.addToStake
      args = [sessionData.address, sessionData.tokenId, parseEther(amount)]
      value = null
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Add to Stake",
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
      account,
      library,
      sessionData,
      generalizedContractCall,
      addTransaction,
      networkSymbol,
    ]
  )
  return {
    onAddToStake,
    isPending,
  }
}

export const useOnAddToBountyVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onAddToBounty = useCallback(
    async (amount: string) => {
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
      method = pricingSessionContract.addToBounty
      estimate = pricingSessionContract.estimateGas.addToBounty
      args = [sessionData.address, sessionData.tokenId]
      value = parseEther(amount)
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Add to Bounty",
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
      account,
      library,
      sessionData,
      generalizedContractCall,
      addTransaction,
      networkSymbol,
    ]
  )
  return {
    onAddToBounty,
    isPending,
  }
}

export const useOnSubmitVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall(
    ReloadDataType.ClaimPoolAndSession
  )
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onSubmitVote = useCallback(
    async (hash: string, stake: string) => {
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
      method = pricingSessionContract.setVote
      estimate = pricingSessionContract.estimateGas.setVote
      args = [sessionData.address, sessionData.tokenId, parseEther(stake), hash]
      value = null
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Submit Vote",
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
      account,
      library,
      sessionData,
      generalizedContractCall,
      addTransaction,
      networkSymbol,
    ]
  )
  return {
    onSubmitVote,
    isPending,
  }
}

export const useOnUpdateVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onUpdateVote = useCallback(
    async (hash: string) => {
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
      method = pricingSessionContract.updateVote
      estimate = pricingSessionContract.estimateGas.updateVote
      args = [sessionData.address, sessionData.tokenId, hash]
      value = null
      const txnCb = async (response: any) => {
        addTransaction(response, {
          summary: "Update Vote",
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
      account,
      library,
      sessionData,
      generalizedContractCall,
      addTransaction,
      networkSymbol,
    ]
  )
  return {
    onUpdateVote,
    isPending,
  }
}

export const useOnWeightVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onWeightVote = useCallback(
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
        ABC_PRICING_SESSION_ADDRESS(networkSymbol),
        ABC_PRICING_SESSION_ABI,
        library,
        account
      )
      method = pricingSessionContract.weightVote
      estimate = pricingSessionContract.estimateGas.weightVote
      args = [
        sessionData.address,
        sessionData.tokenId,
        parseEther(`${appraisalValue}`),
        seed,
      ]
      console.log("args", args)
      console.log("account", account)
      value = null
      const txnCb = async (response: any) => {
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
        cb: txnCb,
      })
    },
    [
      networkSymbol,
      library,
      account,
      sessionData.address,
      sessionData.tokenId,
      generalizedContractCall,
      addTransaction,
    ]
  )
  return {
    onWeightVote,
    isPending,
  }
}

export const useOnSetFinalAppraisal = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onSetFinalAppraisal = useCallback(async () => {
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
    method = pricingSessionContract.setFinalAppraisal
    estimate = pricingSessionContract.estimateGas.setFinalAppraisal
    args = [sessionData.address, sessionData.tokenId]
    value = null
    const txnCb = async (response: any) => {
      addTransaction(response, {
        summary: "Set Final Appraisal",
      })
    }
    await generalizedContractCall({
      method,
      estimate,
      args,
      value,
      cb: txnCb,
    })
  }, [
    networkSymbol,
    library,
    account,
    sessionData.address,
    sessionData.tokenId,
    generalizedContractCall,
    addTransaction,
  ])
  return {
    onSetFinalAppraisal,
    isPending,
  }
}

export const useOnHarvest = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onHarvest = useCallback(async () => {
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
    method = pricingSessionContract.harvest
    estimate = pricingSessionContract.estimateGas.harvest
    args = [sessionData.address, sessionData.tokenId]
    value = null
    const txnCb = async (response: any) => {
      addTransaction(response, {
        summary: "Harvest",
      })
    }
    await generalizedContractCall({
      method,
      estimate,
      args,
      value,
      cb: txnCb,
    })
  }, [
    networkSymbol,
    library,
    account,
    sessionData.address,
    sessionData.tokenId,
    generalizedContractCall,
    addTransaction,
  ])
  return {
    onHarvest,
    isPending,
  }
}

export const useOnClaim = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onClaim = useCallback(async () => {
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
    method = pricingSessionContract.claim
    estimate = pricingSessionContract.estimateGas.claim
    args = [sessionData.address, sessionData.tokenId]
    value = null
    const txnCb = async (response: any) => {
      addTransaction(response, {
        summary: "Claim Tokens",
      })
    }
    await generalizedContractCall({
      method,
      estimate,
      args,
      value,
      cb: txnCb,
    })
  }, [
    networkSymbol,
    library,
    account,
    sessionData.address,
    sessionData.tokenId,
    generalizedContractCall,
    addTransaction,
  ])
  return {
    onClaim,
    isPending,
  }
}

export const useOnEndSession = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()
  const networkSymbol = useGetCurrentNetwork()

  const onEndSession = useCallback(async () => {
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
    method = pricingSessionContract.endSession
    estimate = pricingSessionContract.estimateGas.endSession
    args = [sessionData.address, sessionData.tokenId]
    value = null
    const txnCb = async (response: any) => {
      addTransaction(response, {
        summary: "End Session",
      })
    }
    await generalizedContractCall({
      method,
      estimate,
      args,
      value,
      cb: txnCb,
    })
  }, [
    networkSymbol,
    library,
    account,
    sessionData.address,
    sessionData.tokenId,
    generalizedContractCall,
    addTransaction,
  ])
  return {
    onEndSession,
    isPending,
  }
}
