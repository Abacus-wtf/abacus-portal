import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import {NetworkContextName} from '@config/constants'
import {useCallback} from 'react'
import {web3} from '@config/constants'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { 
  calculateGasMargin, 
} from '@config/utils'
import {useToggleWalletModal} from '@state/application/hooks'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: number } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useWeb3Contract(ABI: any) {
  return useCallback((address: string) => {
    const contract = new web3.eth.Contract(ABI, address)
    return contract
  }, [ABI])
}

export const useGeneralizedContractCall = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useToggleWalletModal()

  return useCallback(async ({
    estimate,
    method,
    args,
    value,
    cb
    }: {
      estimate: any,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<BigNumber | number | string >,
      value: BigNumber | null,
      cb: (response: any) => void
    }) => {
      if (account === undefined || account === null) {
          toggleWalletModal()
          alert('Error processing your request, please login to an Ethereum Wallet provider.');
          return
      }

      if (!library || !chainId ) {
          toggleWalletModal()
          alert('Please login to an Ethereum Wallet provider to move on to the next step.');
          return
      }
      await estimate(...args, value ? { value } : {})
              .then(estimatedGasLimit =>
              method(...args, {
                  ...(value ? { value } : {}),
                  gasLimit: calculateGasMargin(estimatedGasLimit)
              }).then(response => {
                cb(response)
              })
          )
          .catch(error => {
            console.error(error)
          })
  }, [account, chainId, library])
}