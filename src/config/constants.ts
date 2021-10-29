import { InjectedConnector } from '@web3-react/injected-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import Web3 from 'web3'

export const COINGECKO_ETH_USD = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

export const NetworkContextName = 'NETWORK'
export const ETH_RPC = process.env.GATSBY_NETWORK_URL as string
export const NETWORK_CHAIN_ID = Number(process.env.GATSBY_CHAIN_ID as string)
export const IS_PRODUCTION = process.env.GATSBY_IS_PRODUCTION === 'true'
export const OPENSEA_LINK = process.env.GATSBY_OPENSEA_API as string
export const CURRENT_SESSIONS = [
  {
    address: '0x38ec00f7a966ece849f796d1d71aae2eb4c41c2d',
    tokenId: '0'
  }
]

export const ABC_TREASURY_ADDRESS = IS_PRODUCTION ? '' : '0x727519f5F63f2D847c898f75E3603fEf951bc0C3'
export const ABC_TOKEN_ADDRESS = IS_PRODUCTION ? '' : '0x55A57d4A0ff40C26e27Aa2bBB3Deb00CB45516cc'
export const ABC_AUCTION_ADDRESS = IS_PRODUCTION ? '' : '0xecb3B34e65D1a194Ed33215a54FE5a1ab32D8a72'
export const ABC_PRICING_SESSION_ADDRESS = IS_PRODUCTION ? '' : '0x9C38Bd4fEb17598BA2893c80176F8c1bfd5927E0'

interface NetworkInfo {
  rpc: any,
  chainId: number,
  symbol: string,
  network: string,
  logo: string
}

export const web3 = new Web3(ETH_RPC)

export const NetworkInfoMap: NetworkInfo = {
  rpc: ETH_RPC,
  chainId: NETWORK_CHAIN_ID,
  symbol: 'ETH',
  network: IS_PRODUCTION ? 'mainnet' : 'rinkeby',
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