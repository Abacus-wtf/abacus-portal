import { AbstractConnector } from "@web3-react/abstract-connector"
import Web3 from "web3"
import {fortmatic, portis, walletconnect, walletlink, injected} from './connectors'

export declare enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MUMBAI = 80001
}

export const COINGECKO_ETH_USD =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"

export const NetworkContextName = "NETWORK"
export const ETH_RPC = process.env.GATSBY_NETWORK_URL as string
export const NETWORK_CHAIN_ID = Number(process.env.GATSBY_CHAIN_ID as string)
export const IS_PRODUCTION = process.env.GATSBY_IS_PRODUCTION === "true"
export const OPENSEA_LINK = process.env.GATSBY_OPENSEA_API as string
export const CURRENT_SESSIONS = IS_PRODUCTION
  ? [
    {
      address: '0x251b5f14a825c537ff788604ea1b58e49b70726f',
      tokenId: '7274'
    }
  ]
  : [
      {
        address: "0x38ec00f7a966ece849f796d1d71aae2eb4c41c2d",
        tokenId: "1",
      },
    ]

export const ABC_TREASURY_ADDRESS = IS_PRODUCTION
  ? "0xA20B4b391Cd5f581Ab17a8d61388e0fe78dde28C"
  : "0x69421DCF160B85fF2586Ea2c3415b4d48AC0b729"
export const ABC_TOKEN_ADDRESS = IS_PRODUCTION
  ? "0x4Ec341bB76Ea53e57907675C84227F3a0e52a206"
  : "0x5e7aD50819f507f088Aff27196e0F4B9f727fa5b"
export const ABC_AUCTION_ADDRESS = IS_PRODUCTION
  ? "0x46dc64ABa177cA298b827840F285f95498ab3ACd"
  : "0x286c881126b86519221045B9d5DaAd25E4511780"
export const ABC_PRICING_SESSION_ADDRESS = IS_PRODUCTION
  ? "0x37b4932ECeAE6b07b761F4B86975325Cb36c31aD"
  : "0x34F282d640AB5769bd1D868A7425ad9e48B0e10f"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

interface NetworkInfo {
  rpc: any
  chainId: number
  symbol: string
  network: string
  logo: string
}

export const web3 = new Web3(ETH_RPC)

export const NetworkInfoMap: NetworkInfo = {
  rpc: ETH_RPC,
  chainId: NETWORK_CHAIN_ID,
  symbol: "ETH",
  network: IS_PRODUCTION ? "mainnet" : "rinkeby",
  logo: "/ETH.svg",
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

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  /*INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },*/
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Wallet Link',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const DISCORD_WEBHOOK_URL = {
  NEW_BID: `https://discord.com/api/webhooks/907310849281101834/lzZaPwL0IoPKyRgP7NBqVmufGHs23jMAIncuHlsU6zcZPDjFnryELIpbTZVDae--TcK2`,
}
