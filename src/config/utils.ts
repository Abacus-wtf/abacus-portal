import { getAddress } from "@ethersproject/address"
import { OPENSEA_LINK, web3Eth } from "@config/constants"
import axios, { AxiosResponse } from "axios"
import axiosRetry from "axios-retry"
import { BigNumber } from "@ethersproject/bignumber"
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers"
import { Contract } from "@ethersproject/contracts"
import { AddressZero } from "@ethersproject/constants"
import { keccak256 } from "@ethersproject/keccak256"

axiosRetry(axios, { retries: 3 })

export function isWithinFivePercent(appraisal: number, finalAppraisal: number) {
  return (
    appraisal >= finalAppraisal * 0.95 && appraisal <= finalAppraisal * 1.05
  )
}

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    return ""
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export type OpenSeaAsset = {
  image_preview_url?: string
  image_url: string
  animation_url: string | null
  asset_contract: {
    name: string
    address: string
  }
  collection: {
    name: string
  }
  token_id: string
  name: string
  owner?: {
    address: string
    user?: {
      username: string
    }
  }
  permalink: string
}

const DEFAULT_ASSET: OpenSeaAsset = {
  image_url: "",
  animation_url: "",
  permalink: "",
  asset_contract: {
    name: "",
    address: "",
  },
  collection: {
    name: "",
  },
  token_id: "",
  name: "",
}

export type OpenSeaGetResponse = {
  assets: OpenSeaAsset[]
}

export async function openseaGet<T = OpenSeaAsset>(input: string) {
  let result: AxiosResponse<T>
  try {
    result = await axios.get<T>(OPENSEA_LINK + input, {
      decompress: false,
    })
    return result.data
  } catch (e) {
    console.log("e", e)
    return DEFAULT_ASSET
  }
}

function isOpenSeaAsset(
  asset: OpenSeaAsset | OpenSeaGetResponse
): asset is OpenSeaAsset {
  return (asset as OpenSeaAsset).token_id !== undefined
}

export type OpenSeaGetManyParams = { nftAddress: string; tokenId: string }[]

export async function openseaGetMany(pricingSessions: OpenSeaGetManyParams) {
  const URL = `assets?${pricingSessions
    .map((session) => `asset_contract_addresses=${session.nftAddress}&`)
    .toString()}${pricingSessions
    .map((session) => `token_ids=${session.tokenId}&`)
    .toString()}`
  const result = await openseaGet<OpenSeaGetResponse>(URL.replaceAll(",", ""))
  if (isOpenSeaAsset(result)) {
    const DEFAULT_OPENSEA_GET_RESPONSE: OpenSeaGetResponse = {
      assets: pricingSessions.map((session) => ({
        ...DEFAULT_ASSET,
        asset_contract: { ...DEFAULT_ASSET, address: session.nftAddress },
        token_id: session.tokenId,
      })),
    }
    return DEFAULT_OPENSEA_GET_RESPONSE
  }
  return result
}

export function hashValues({
  appraisalValue,
  account,
  password,
}: {
  appraisalValue: BigNumber
  account: string
  password: number
}) {
  let encodedParams = web3Eth.eth.abi.encodeParameters(
    ["uint", "address", "uint"],
    [appraisalValue, account, password]
  )
  encodedParams =
    encodedParams.slice(0, 64) + encodedParams.slice(88, encodedParams.length)
  return keccak256(encodedParams)
}

export function encodeSessionData({
  account,
  nftAddress,
  nonce,
  tokenId,
}: {
  account: string
  nftAddress: string
  nonce: number
  tokenId: string
}) {
  return web3Eth.eth.abi.encodeParameters(
    ["uint", "address", "address", "uint"],
    [nonce, nftAddress, account, tokenId]
  )
}

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000))
}

export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  )
}
