// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AbstractConnector } from "@web3-react/abstract-connector"
import { InjectedConnector } from "@web3-react/injected-connector"
import Web3 from "web3"
import {
  fortmatic,
  portis,
  walletconnect,
  walletlink,
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
  NONE = "SOLID_NUTHIN",
  ETH = "ETH",
  ARBITRUM = "AETH",
}

export const OPENSEA_API_KEY = process.env.GATSBY_OPENSEA_API_KEY || undefined
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
export const BACKEND_LINK = process.env.GATSBY_APP_SERVER as string

const ETH_ABC_VAULT_CONTRACT = IS_PRODUCTION ? "" : ""
const ETH_ABC_TREASURY_ADDRESS = IS_PRODUCTION
  ? "0xA20B4b391Cd5f581Ab17a8d61388e0fe78dde28C"
  : "0x593978a0Db0473D813943b0dAfB5bCE1aF3Ab506"
const ETH_ABC_TOKEN_ADDRESS = IS_PRODUCTION
  ? "0x4Ec341bB76Ea53e57907675C84227F3a0e52a206"
  : "0xE873Bf0b6705Ac231cDB18491e1518873a3C5754"
const ETH_ABC_AUCTION_ADDRESS = IS_PRODUCTION
  ? "0x46dc64ABa177cA298b827840F285f95498ab3ACd"
  : "0xc34fe8aa917716B6c12C7234EE4a7D91B231cBE1"
const ETH_ABC_PRICING_SESSION_ADDRESS = IS_PRODUCTION
  ? "0x37b4932ECeAE6b07b761F4B86975325Cb36c31aD"
  : "0x0816DdF293398927736E117Bc60eb6F7fB1195AA"

const ARB_ABC_VAULT_CONTRACT = IS_PRODUCTION
  ? "0xB3f1069B04726C145197853Db772483Bd6B9650D"
  : "0x919FD1373e7A2cdf5573aAf0D9AEB5D47B4BEa18"
const ARB_ABC_TREASURY_ADDRESS = IS_PRODUCTION
  ? "0x1e5C3433F511A9AaAf371406A5BEb8F883eB7EfA"
  : "0xae3bC10024D671C66874BD2952b246Aa1dbB60ad"
const ARB_ABC_TOKEN_ADDRESS = IS_PRODUCTION
  ? ""
  : "0xee67Ba7cE197d0eC0Ff34E4653E040d2B339c7b8"
const ARB_ABC_AUCTION_ADDRESS = IS_PRODUCTION
  ? "0x396dd1f7E3c8044784937935F834C3F8d58EB497"
  : "0xB13b4F30f88d59B3Fd2Dc6413A1786081008BD4f"
const ARB_ABC_PRICING_SESSION_ADDRESS = IS_PRODUCTION
  ? "0x4Bbd138e2Ba312754B1d075DEdf2F337521Dd638"
  : "0xdA1A7C756C63744e6Fc04b389901bfb5824C2Fa0"

export const ABC_VAULT_ADDRESS = (networkSymbol: NetworkSymbolEnum) => {
  switch (networkSymbol) {
    case NetworkSymbolEnum.ETH:
      return ETH_ABC_VAULT_CONTRACT
    case NetworkSymbolEnum.ARBITRUM:
      return ARB_ABC_VAULT_CONTRACT
    case NetworkSymbolEnum.NONE:
      return ARB_ABC_VAULT_CONTRACT
    default:
      return ""
  }
}

export const ABC_TREASURY_ADDRESS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_ABC_TREASURY_ADDRESS
    : ARB_ABC_TREASURY_ADDRESS

export const ABC_TOKEN_ADDRESS = (networkSymbol: NetworkSymbolEnum) =>
  networkSymbol === NetworkSymbolEnum.ETH
    ? ETH_ABC_TOKEN_ADDRESS
    : ARB_ABC_TOKEN_ADDRESS

export const ABC_AUCTION_ADDRESS = (networkSymbol: NetworkSymbolEnum) => {
  switch (networkSymbol) {
    case NetworkSymbolEnum.ETH:
      return ETH_ABC_AUCTION_ADDRESS
    case NetworkSymbolEnum.ARBITRUM:
      return ARB_ABC_AUCTION_ADDRESS
    case NetworkSymbolEnum.NONE:
      return ARB_ABC_AUCTION_ADDRESS
    default:
      return ""
  }
}
export const ABC_PRICING_SESSION_ADDRESS = (
  networkSymbol: NetworkSymbolEnum
) => {
  switch (networkSymbol) {
    case NetworkSymbolEnum.ETH:
      return ETH_ABC_PRICING_SESSION_ADDRESS
    case NetworkSymbolEnum.ARBITRUM:
      return ARB_ABC_PRICING_SESSION_ADDRESS
    case NetworkSymbolEnum.NONE:
      return ARB_ABC_PRICING_SESSION_ADDRESS
    default:
      return ""
  }
}
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
  /* INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  }, */
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
