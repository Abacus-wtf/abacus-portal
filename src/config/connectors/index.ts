import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'

// import {ETHER, MATIC} from "@unicly/sdk";
// import * as process from "process";

const FORMATIC_KEY = process.env.GATSBY_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.GATSBY_APP_PORTIS_ID;


export interface NetworkInfo {
  rpc: any,
  chainId: number,
  symbol: string,
  network: string,
  logo: string

}



//network list
export const NETWORK_URL: any = process.env.GATSBY_NETWORK_URL


//chain list
export const MATIC_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID_MATIC!)
export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID!)
export const MUMBAI_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID_MUMBAI!)


export const NetworkInfoMap: NetworkInfo[] = [
  {
    rpc: NETWORK_URL,
    chainId: NETWORK_CHAIN_ID,
    symbol: 'ETH',
    network: 'Ethereum Mainnet',
    logo: '/ETH.svg'
  }
]


export type NetworkSymbol = "ETH";

export enum NetworkSymbolEnum  {
  ETH = 'ETH'
}

type NetworkList = Record<NetworkSymbolEnum, NetworkInfo>;

// network object info by symbol
export const NetworkSelectorList: NetworkList = {
  ETH: {rpc: NETWORK_URL, chainId: NETWORK_CHAIN_ID, symbol: 'ETH', network: 'Ethereum Mainnet', logo: 'ETH.svg'},
};

//select network by chain id
export const NetworkSymbolAndId = {
  [NETWORK_CHAIN_ID]:NetworkSymbolEnum.ETH,

}

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`GATSBY_NETWORK_URL must be a defined environment variable`)
}

export const network = (networkSymbol: NetworkSymbolEnum) => new NetworkConnector({
  urls: { [NetworkSelectorList[networkSymbol].chainId]: NetworkSelectorList[networkSymbol].rpc}
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(networkSymbol: NetworkSymbolEnum): Web3Provider {
  // const networkSymbol = useSelector((state: AppState) => state.application.networkSymbol)
  return (networkLibrary = networkLibrary ?? new Web3Provider(network(networkSymbol).provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 137, 80001]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Abacus Protocol',
  appLogoUrl: '🧮'
})
