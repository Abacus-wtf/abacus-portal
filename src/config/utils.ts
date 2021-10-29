import { getAddress } from '@ethersproject/address'
import {OPENSEA_LINK} from '@config/constants'
import axios from 'axios'
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

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
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export async function openseaGet(input: string) {
  let result: any
  try { 
      result = await axios.get(OPENSEA_LINK + input, {
          decompress: false
      })
  }
  catch (e) {
      console.log('e')
      console.log(e)
  }
  return result.data
}
