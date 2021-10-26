import {useCallback} from 'react'
import {
  setSingleTokenMetadata
} from './actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'

export const useGetSingleTokenMetadata = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async (id: string) => {
    const tokenMetadata = {
      img: 'https://g.foolcdn.com/art/companylogos/square/btc.png',
      name: 'Bitcoin',
      symbol: 'BTC',
      marketCap: 100,
      address: "0x",
      volume: 10,
      price: 1,
      supply: 100
    }
    dispatch(setSingleTokenMetadata(tokenMetadata))
  }, [dispatch])
}