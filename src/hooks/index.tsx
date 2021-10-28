import {useEffect, useState} from 'react'
import {NetworkInfoMap} from '@config/constants'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import {NetworkContextName, ETH_RPC} from '@config/constants'
import {useCallback} from 'react'
import Web3 from 'web3'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: number } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useWeb3Contract(ABI: any) {
  return useCallback((address: string) => {
    let web3 = new Web3(ETH_RPC)
    const contract = new web3.eth.Contract(ABI, address)
    return contract
  }, [ABI])
}