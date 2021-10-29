import {useCallback} from 'react'
import {
  getMultipleSessionData,
  getCurrentSessionData
} from './actions'
import {SessionData} from './reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'
import {useWeb3Contract} from '@hooks/index'
import { ABC_PRICING_SESSION_ADDRESS, CURRENT_SESSIONS, COINGECKO_ETH_USD } from '@config/constants'
import ABC_PRICING_SESSION_ABI from '@config/contracts/ABC_PRICING_SESSION_ABI.json'
import _ from 'lodash'
import { openseaGet, shortenAddress } from '@config/utils'
import { formatEther } from 'ethers/lib/utils'
import axios from 'axios'

export const useGetMultiSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)

  return useCallback(async () => {
    const pricingSession = getPricingSessionContract(ABC_PRICING_SESSION_ADDRESS)
    
    // TODO: Make sure API works for more than 20 contracts
    let URL = `assets?` + _.map(CURRENT_SESSIONS, (i) => {
        return `asset_contract_addresses=${i.address}&token_ids=${Number(i.tokenId)}&`
    })
    URL = URL.replaceAll(',', '')
    let pricingSessionMetadata = await openseaGet(URL)
    pricingSessionMetadata = pricingSessionMetadata.assets

    const pricingSessionNonce = await Promise.all(_.map(CURRENT_SESSIONS, (session) => 
      pricingSession.methods.nftNonce(session.address, session.tokenId).call()
    ))

    const pricingSessionData = await Promise.all(_.map(_.range(0, CURRENT_SESSIONS.length), (i) => 
      pricingSession.methods.NftSessionCore(pricingSessionNonce[i], CURRENT_SESSIONS[i].address, CURRENT_SESSIONS[i].tokenId).call()
    ))

    const sessionData: SessionData[] = _.map(_.range(0, CURRENT_SESSIONS.length), (i) => {
      return {
        img: pricingSessionMetadata[i].image_preview_url || pricingSessionMetadata[i].image_url,
        endTime: Number(pricingSessionData[i].endTime)*1000,
        numPpl: Number(pricingSessionData[i].uniqueVoters),
        title: pricingSessionMetadata[i].collection.name,
        totalStaked: Number(formatEther(pricingSessionData[i].totalSessionStake)),
        nftName: pricingSessionMetadata[i].name,
        address: CURRENT_SESSIONS[i].address,
        tokenId: CURRENT_SESSIONS[i].tokenId,
        nonce: Number(pricingSessionNonce[i]),
        owner: pricingSessionMetadata[i].owner.user && pricingSessionMetadata[i].owner.user.username ? pricingSessionMetadata[i].owner.user.username : shortenAddress(pricingSessionMetadata[i].owner.address)
      }
    })
    dispatch(getMultipleSessionData(sessionData))
  }, [dispatch])
}

export const useGetCurrentSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)

  return useCallback(async (address: string, tokenId: string, nonce: number) => {
    const pricingSession = getPricingSessionContract(ABC_PRICING_SESSION_ADDRESS)
    
    // TODO: Make sure API works for more than 20 contracts
    let URL = `asset/${address}/${tokenId}`
    const [pricingSessionMetadata, pricingSessionData, ethUsd] = await Promise.all([
      openseaGet(URL),
      pricingSession.methods.NftSessionCore(nonce, address, tokenId).call(),
      axios.get(COINGECKO_ETH_USD)
    ])

    const sessionData: SessionData = {
        img: pricingSessionMetadata.image_preview_url || pricingSessionMetadata.image_url,
        endTime: Number(pricingSessionData.endTime)*1000,
        numPpl: Number(pricingSessionData.uniqueVoters),
        title: pricingSessionMetadata.collection.name,
        totalStaked: Number(formatEther(pricingSessionData.totalSessionStake)),
        totalStakedInUSD: Number(formatEther(pricingSessionData.totalSessionStake)) * Number(ethUsd.data.ethereum.usd),
        nftName: pricingSessionMetadata.name,
        address: address,
        tokenId: tokenId,
        nonce: nonce,
        owner: pricingSessionMetadata.owner.user && pricingSessionMetadata.owner.user.username ? pricingSessionMetadata.owner.user.username : shortenAddress(pricingSessionMetadata.owner.address)
      }

    dispatch(getCurrentSessionData(sessionData))
  }, [dispatch])
}