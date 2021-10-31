import {useCallback} from 'react'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { parseEther } from 'ethers/lib/utils'
import { useSelector } from 'react-redux'
import {AppState} from '@state/index'
import {getContract} from '@config/utils'
import { ABC_PRICING_SESSION_ADDRESS } from '@config/constants'
import ABC_PRICING_SESSION_ABI from '@config/contracts/ABC_PRICING_SESSION_ABI.json'
import {useGeneralizedContractCall} from './'
import {useActiveWeb3React} from '@hooks/index'
import {useTransactionAdder} from '@state/transactions/hooks'

export const useOnSubmitVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(async (hash: string, stake: string, cb: (hash: string) => void) => {
      let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<BigNumber | number | string >,
      value: BigNumber | null

      const pricingSessionContract = getContract(ABC_PRICING_SESSION_ADDRESS, ABC_PRICING_SESSION_ABI, library, account)
      method = pricingSessionContract.setVote
      estimate = pricingSessionContract.estimateGas.setVote
      args = [
        sessionData.address,
        Number(sessionData.tokenId),
        hash
      ]
      value = parseEther(stake)
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: 'Submit Vote'
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        txnCb
      })
  }, [account, library, sessionData])
}

export const useOnUpdateVote = () => {
  const { account, library } = useActiveWeb3React()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const generalizedContractCall = useGeneralizedContractCall()
  const addTransaction = useTransactionAdder()

  return useCallback(async (hash: string, cb: (hash: string) => void) => {
      let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<BigNumber | number | string >,
      value: BigNumber | null

      const pricingSessionContract = getContract(ABC_PRICING_SESSION_ADDRESS, ABC_PRICING_SESSION_ABI, library, account)
      method = pricingSessionContract.updateVote
      estimate = pricingSessionContract.estimateGas.updateVote
      args = [
        sessionData.address,
        Number(sessionData.tokenId),
        hash
      ]
      value = null
      const txnCb = (response: any) => {
        addTransaction(response, {
          summary: 'Update Vote'
        })
        cb(response.hash)
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        txnCb
      })
  }, [account, library, sessionData])
}