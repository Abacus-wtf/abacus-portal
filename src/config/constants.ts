import { AbstractConnector } from "@web3-react/abstract-connector"
import { InjectedConnector } from "@web3-react/injected-connector"
import Web3 from "web3"
import {
  fortmatic,
  portis,
  walletconnect,
  walletlink,
  network,
  InjectedConnectorProps,
} from "./connectors"

export declare enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MUMBAI = 80001,
}

export type NetworkSymbol = "ETH" | "AETH"

export enum NetworkSymbolEnum {
  ETH = "ETH",
  ARBITRUM = "AETH",
}

export const NetworkContextName = "NETWORK"
export const ETH_RPC = process.env.GATSBY_NETWORK_URL as string
export const ARBITRUM_ETH_RPC = process.env
  .GATSBY_APP_ARBITRUM_NETWORK_URL as string
export const ARBITRUM_NETWORK_CHAIN_ID = Number(
  process.env.GATSBY_APP_ARBITRUM_CHAIN_ID as string
)
export const NETWORK_CHAIN_ID = Number(process.env.GATSBY_CHAIN_ID as string)
export const IS_PRODUCTION = process.env.GATSBY_IS_PRODUCTION === "true"
export const OPENSEA_LINK = process.env.GATSBY_OPENSEA_API as string

const ARB_CURRENT_SESSIONS = IS_PRODUCTION
  ? []
  : [
      {
        address: "0x16baf0de678e52367adc69fd067e5edd1d33e3bf",
        tokenId: "5770",
      },
    ]

const ETH_CURRENT_SESSIONS = IS_PRODUCTION
  ? [
      {
        address: "0x251b5f14a825c537ff788604ea1b58e49b70726f",
        tokenId: "7274",
      },
    ]
  : [
      {
        address: "0x38ec00f7a966ece849f796d1d71aae2eb4c41c2d",
        tokenId: "1",
      },
    ]

const ETH_ABC_TREASURY_ADDRESS = IS_PRODUCTION
  ? "0xA20B4b391Cd5f581Ab17a8d61388e0fe78dde28C"
  : "0xDaE10C0E9568Abcd67a148A28f44d98a13057ee4"
const ETH_ABC_TOKEN_ADDRESS = IS_PRODUCTION
  ? "0x4Ec341bB76Ea53e57907675C84227F3a0e52a206"
  : "0xa844cCb9cd7B7c3ED5CC125F400486d8a95264d2"
const ETH_ABC_AUCTION_ADDRESS = IS_PRODUCTION
  ? "0x46dc64ABa177cA298b827840F285f95498ab3ACd"
  : "0x1edfa8988e5DE42A4d59576Dcaad82b7fcf3BAe6"
const ETH_ABC_PRICING_SESSION_ADDRESS = IS_PRODUCTION
  ? "0x37b4932ECeAE6b07b761F4B86975325Cb36c31aD"
  : "0x703aF675A1575B6Da55d8B99035A6eE4d4C5B051"

const ARB_ABC_TREASURY_ADDRESS = IS_PRODUCTION
  ? ""
  : "0x20d76475944C51871a72833c375F51C56FC06195"
const ARB_ABC_TOKEN_ADDRESS = IS_PRODUCTION
  ? ""
  : "0x01D639356F80F1982eef8438681Aa7Cf29F402De"
const ARB_ABC_AUCTION_ADDRESS = IS_PRODUCTION
  ? "0xf50056e8712939AA932CDD68d1101271bb3d4A1E"
  : "0xB61E87a81e938e8C9CA39c327c88bF00f2F1aE7B"
const ARB_ABC_PRICING_SESSION_ADDRESS = IS_PRODUCTION
  ? ""
  : "0x3FeB5e620A1826E8892374079E0bBAA7963fB9Aa"

export const CURRENT_SESSIONS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_CURRENT_SESSIONS
    : ARB_CURRENT_SESSIONS

export const ABC_TREASURY_ADDRESS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_ABC_TREASURY_ADDRESS
    : ARB_ABC_TREASURY_ADDRESS

export const ABC_TOKEN_ADDRESS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_ABC_TOKEN_ADDRESS
    : ARB_ABC_TOKEN_ADDRESS

export const ABC_AUCTION_ADDRESS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_ABC_AUCTION_ADDRESS
    : ARB_ABC_AUCTION_ADDRESS

export const ABC_PRICING_SESSION_ADDRESS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_ABC_PRICING_SESSION_ADDRESS
    : ARB_ABC_PRICING_SESSION_ADDRESS

export const ETH_USD_ORACLE_ADDRESS =
  "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export interface NetworkInfo {
  rpc: any
  chainId: number
  symbol: string
  network: string
  logo: string
  blockExplorer: string
}

const NETWORK_ADDRESSES = {
  [NetworkSymbolEnum.ETH]: ETH_RPC,
  [NetworkSymbolEnum.ARBITRUM]: ARBITRUM_ETH_RPC,
}

export const web3 = (networkSymbol: NetworkSymbolEnum) =>
  new Web3(NETWORK_ADDRESSES[networkSymbol])

export const web3Eth = new Web3(ETH_RPC)

export const NetworkInfoMap: NetworkInfo[] = [
  {
    rpc: ETH_RPC,
    chainId: NETWORK_CHAIN_ID,
    symbol: "ETH",
    network: IS_PRODUCTION ? "Ethereum Mainnet" : "Rinkeby Test Network",
    logo: "ETH.svg",
    blockExplorer: IS_PRODUCTION
      ? "https://etherscan.io/#/"
      : "https://rinkeby.etherscan.io/#/",
  },
  {
    rpc: ARBITRUM_ETH_RPC,
    chainId: ARBITRUM_NETWORK_CHAIN_ID,
    symbol: "AETH",
    network: IS_PRODUCTION ? "Arbitrum One" : "Arbitrum Testnet Rinkeby",
    logo: "AETH.svg",
    blockExplorer: IS_PRODUCTION
      ? "https://explorer.arbitrum.io/#/"
      : "https://rinkeby-explorer.arbitrum.io/#/",
  },
]

export const NetworkSymbolAndId = {
  [NETWORK_CHAIN_ID]: NetworkSymbolEnum.ETH,
  [ARBITRUM_NETWORK_CHAIN_ID]: NetworkSymbolEnum.ARBITRUM,
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
    connector: new InjectedConnector(InjectedConnectorProps),
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "WalletConnect",
    iconName: "walletConnectIcon.svg",
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
    mobile: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: "Wallet Link",
    iconName: "coinbaseWalletIcon.svg",
    description: "Use Coinbase Wallet app on mobile device",
    href: null,
    color: "#315CF5",
  },
  FORTMATIC: {
    connector: fortmatic,
    name: "Fortmatic",
    iconName: "fortmaticIcon.png",
    description: "Login using Fortmatic hosted wallet",
    href: null,
    color: "#6748FF",
    mobile: true,
  },
  Portis: {
    connector: portis,
    name: "Portis",
    iconName: "portisIcon.png",
    description: "Login using Portis hosted wallet",
    href: null,
    color: "#4A6C9B",
    mobile: true,
  },
}

export const DISCORD_WEBHOOK_URL = {
  NEW_BID: `https://discord.com/api/webhooks/907310849281101834/lzZaPwL0IoPKyRgP7NBqVmufGHs23jMAIncuHlsU6zcZPDjFnryELIpbTZVDae--TcK2`,
}
