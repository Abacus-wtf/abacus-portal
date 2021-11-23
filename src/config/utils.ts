import { getAddress } from "@ethersproject/address"
import { OPENSEA_LINK, web3Eth } from "@config/constants"
import axios from "axios"
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

export async function openseaGet(input: string) {
  let result: any
  try {
    result = await axios.get(OPENSEA_LINK + input, {
      decompress: false,
    })
    return result.data
  } catch (e) {
    console.log("e")
    console.log(e)
    return null
  }
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
