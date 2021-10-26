import {useCallback} from 'react'
import {
  getMultipleSessionData
} from './actions'
import {SessionData} from './reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'

export const useGetMultiSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    const sessionData: SessionData[] = [
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      },
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      },
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      },
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      },
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      },
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      },
      {
        img: 'https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-mobileMasterAt3x.jpg',
        endTime: Date.now() + 50000000,
        numPpl: 25,
        title: 'Gen 3',
        totalStaked: 25,
        nftName: 'Cyber Cities',
        address: '0x',
        tokenId: '110'
      }
    ]
    dispatch(getMultipleSessionData(sessionData))
  }, [dispatch])
}