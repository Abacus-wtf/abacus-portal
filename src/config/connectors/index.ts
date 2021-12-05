import { Web3Provider } from "@ethersproject/providers"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import { PortisConnector } from "@web3-react/portis-connector"

import { NetworkSymbolEnum, NetworkInfoMap } from "@config/constants"
import { FortmaticConnector } from "./Fortmatic"
import { NetworkConnector } from "./NetworkConnector"

// import {ETHER, MATIC} from "@unicly/sdk";
// import * as process from "process";

const FORMATIC_KEY = process.env.GATSBY_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.GATSBY_APP_PORTIS_ID

export interface NetworkInfo {
  rpc: any
  chainId: number
  symbol: string
  network: string
  logo: string
}

export const network = (networkSymbol: NetworkSymbolEnum) =>
  new NetworkConnector({
    urls: {
      [NetworkInfoMap[networkSymbol].chainId]:
        NetworkInfoMap[networkSymbol].rpc,
    },
  })

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(
  networkSymbol: NetworkSymbolEnum
): Web3Provider {
  networkLibrary =
    networkLibrary ?? new Web3Provider(network(networkSymbol).provider as any)
  // const networkSymbol = useSelector((state: AppState) => state.application.networkSymbol)
  return networkLibrary
}

export const InjectedConnectorProps = {
  supportedChainIds: [1, 3, 4, 5, 42, 56, 137, 42161, 421611, 80001],
}

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: process.env.GATSBY_NETWORK_URL as string },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? "",
  chainId: 1,
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? "",
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: process.env.GATSBY_NETWORK_URL as string,
  appName: "Abacus Protocol",
  appLogoUrl: "🧮",
})
