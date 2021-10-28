import { InjectedConnector } from '@web3-react/injected-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'

export const NetworkContextName = 'NETWORK'
export const ETH_RPC = process.env.REACT_APP_NETWORK_URL as string
export const NETWORK_CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID as string)

interface NetworkInfo {
  rpc: any,
  chainId: number,
  symbol: string,
  network: string,
  logo: string
}

export const NetworkInfoMap: NetworkInfo = {
  rpc: ETH_RPC,
  chainId: NETWORK_CHAIN_ID,
  symbol: 'ETH',
  network: NETWORK_CHAIN_ID === 1 ? 'mainnet' : 'rinkeby',
  logo: '/ETH.svg'
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 137, 80001]
})

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}