import { getAddress } from "@ethersproject/address"
import { OPENSEA_API_KEY, OPENSEA_LINK, web3Eth } from "@config/constants"
import axios, { AxiosResponse } from "axios"
import axiosRetry from "axios-retry"
import { BigNumber } from "@ethersproject/bignumber"
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers"
import { Contract } from "@ethersproject/contracts"
import { AddressZero } from "@ethersproject/constants"
import { keccak256 } from "@ethersproject/keccak256"
import { formatEther } from "ethers/lib/utils"

axiosRetry(axios, { retries: 3 })

export const formatPricingSessionCoreMulticall = (pricingSessionCore: any) => ({
  endTime: parseInt(pricingSessionCore[0].hex, 16),
  bounty: Number(formatEther(pricingSessionCore[1])),
  keeperReward: Number(formatEther(pricingSessionCore[2])),
  lowestStake: Number(formatEther(pricingSessionCore[3])),
  maxAppraisal: Number(formatEther(pricingSessionCore[4])),
  totalAppraisalValue: Number(formatEther(pricingSessionCore[5])),
  totalSessionStake: Number(formatEther(pricingSessionCore[6])),
  totalProfit: Number(formatEther(pricingSessionCore[7])),
  totalWinnerPoints: parseInt(pricingSessionCore[8].hex, 16),
  totalVotes: parseInt(pricingSessionCore[9].hex, 16),
  uniqueVoters: parseInt(pricingSessionCore[10].hex, 16),
  votingTime: parseInt(pricingSessionCore[11].hex, 16),
})

export const formatPricingSessionCheckMulticall = (
  pricingSessionCheck: any
) => ({
  revealedStake: `${parseInt(pricingSessionCheck[0].hex, 16)}`,
  sessionProgression: `${parseInt(pricingSessionCheck[1].hex, 16)}`,
  calls: `${parseInt(pricingSessionCheck[2].hex, 16)}`,
  correct: `${parseInt(pricingSessionCheck[3].hex, 16)}`,
  incorrect: `${parseInt(pricingSessionCheck[4].hex, 16)}`,
  defender: `${parseInt(pricingSessionCheck[5].hex, 16)}`,
  spread: `${parseInt(pricingSessionCheck[6].hex, 16)}`,
  riskFactor: `${parseInt(pricingSessionCheck[7].hex, 16)}`,
  finalStdev: `${formatEther(pricingSessionCheck[8].hex)}`,
  secondaryPoints: `${parseInt(pricingSessionCheck[9].hex, 16)}`,
})

export function isWithinWinRange(
  appraisal: number,
  finalAppraisal: number,
  winnerAmount: number
) {
  if (winnerAmount === 0.05) {
    return (
      appraisal >= finalAppraisal * 0.95 && appraisal <= finalAppraisal * 1.05
    )
  }
  return (
    appraisal >= finalAppraisal - Number(winnerAmount) &&
    appraisal <= finalAppraisal + Number(winnerAmount)
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

export const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")

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
      headers: OPENSEA_API_KEY
        ? {
            "X-API-KEY": OPENSEA_API_KEY,
          }
        : {},
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
  if (!account) {
    return ""
  }
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
