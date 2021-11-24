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
    return ''
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export type OpenSeaAsset = {
  image_preview_url?: string
  image_url: string
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
    console.log("e")
    console.log(e)
    return null
  }
}

export type OpenSeaGetManyParams = { nftAddress: string; tokenId: string }[]

export async function openseaGetMany(pricingSessions: OpenSeaGetManyParams) {
  const URL = `assets?${pricingSessions
    .map(session => `asset_contract_addresses=${session.nftAddress}&`)
    .toString()}${pricingSessions
    .map(session => `token_ids=${session.tokenId}&`)
    .toString()}`
  const result = await openseaGet<OpenSeaGetResponse>(URL.replaceAll(",", ""))
  return result    
}

export function hashValues({nonce, address, tokenId}: {nonce: number, address: string, tokenId: string}) {
  const encodedParams = web3Eth.eth.abi.encodeParameters(
    [ "uint", "address", "uint"],
    [nonce, address, tokenId]
  )
  return keccak256(encodedParams.slice(0, 66) + encodedParams.slice(90, encodedParams.length))
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
