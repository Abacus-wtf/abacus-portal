import { FortmaticConnector as FortmaticConnectorCore } from "@web3-react/fortmatic-connector"

export const OVERLAY_READY = "OVERLAY_READY"

type FormaticSupportedChains = Extract<
  ChainId,
  ChainId.MAINNET | ChainId.ROPSTEN | ChainId.RINKEBY | ChainId.KOVAN
>

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MUMBAI = 80001,
}

const CHAIN_ID_NETWORK_ARGUMENT: {
  readonly [chainId in FormaticSupportedChains]: string | undefined
} = {
  [ChainId.MAINNET]: undefined,
  [ChainId.ROPSTEN]: "ropsten",
  [ChainId.RINKEBY]: "rinkeby",
  [ChainId.KOVAN]: "kovan",
}

export class FortmaticConnector extends FortmaticConnectorCore {
  async activate() {
    if (!this.fortmatic) {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { default: Fortmatic } = await import("fortmatic")

      const { apiKey, chainId } = this as any
      if (chainId in CHAIN_ID_NETWORK_ARGUMENT) {
        this.fortmatic = new Fortmatic(
          apiKey,
          CHAIN_ID_NETWORK_ARGUMENT[chainId as FormaticSupportedChains]
        )
      } else {
        throw new Error(`Unsupported network ID: ${chainId}`)
      }
    }

    const provider = this.fortmatic.getProvider()

    const pollForOverlayReady = new Promise((resolve) => {
      const interval = setInterval(() => {
        if (provider.overlayReady) {
          clearInterval(interval)
          this.emit(OVERLAY_READY)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resolve()
        }
      }, 200)
    })

    const [account] = await Promise.all([
      provider.enable().then((accounts: string[]) => accounts[0]),
      pollForOverlayReady,
    ])

    return {
      provider: this.fortmatic.getProvider(),
      chainId: (this as any).chainId,
      account,
    }
  }
}
