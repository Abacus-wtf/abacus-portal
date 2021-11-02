import { useCallback } from "react"
import { AppState } from "@state/index"
import { useDispatch, useSelector } from "react-redux"
import {
  getMultipleSessionData,
  getCurrentSessionData,
  setUserStatus,
} from "./actions"
import {
  SessionData,
  CurrentSessionState,
  UserState,
  SessionState,
} from "./reducer"
import { AppDispatch } from "../index"
import { useWeb3Contract, useActiveWeb3React } from "@hooks/index"
import {
  ABC_PRICING_SESSION_ADDRESS,
  CURRENT_SESSIONS,
  COINGECKO_ETH_USD,
} from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import _ from "lodash"
import { openseaGet, shortenAddress } from "@config/utils"
import { formatEther } from "ethers/lib/utils"
import axios from "axios"

export const useGetMultiSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)

  return useCallback(async () => {
    const pricingSession = getPricingSessionContract(
      ABC_PRICING_SESSION_ADDRESS
    )

    // TODO: Make sure API works for more than 20 contracts
    let URL =
      `assets?` +
      _.map(CURRENT_SESSIONS, i => {
        return `asset_contract_addresses=${i.address}&token_ids=${Number(
          i.tokenId
        )}&`
      })
    URL = URL.replaceAll(",", "")
    let pricingSessionMetadata = await openseaGet(URL)
    pricingSessionMetadata = pricingSessionMetadata.assets

    if (!_.get(pricingSession, "currentProvider")) {
      return
    }

    const pricingSessionNonce = await Promise.all(
      _.map(CURRENT_SESSIONS, session =>
        pricingSession.methods.nftNonce(session.address, session.tokenId).call()
      )
    )

    const statuses = await Promise.all(
      _.map(CURRENT_SESSIONS, session =>
        pricingSession.methods
          .getStatus(session.address, session.tokenId)
          .call()
      )
    )

    const finalAppraisalValues = await Promise.all(
      _.map(_.range(0, CURRENT_SESSIONS.length), i =>
        pricingSession.methods
          .finalAppraisalValue(
            Number(pricingSessionNonce[i]),
            CURRENT_SESSIONS[i].address,
            CURRENT_SESSIONS[i].tokenId
          )
          .call()
      )
    )

    const pricingSessionData = await Promise.all(
      _.map(_.range(0, CURRENT_SESSIONS.length), i =>
        pricingSession.methods
          .NftSessionCore(
            pricingSessionNonce[i],
            CURRENT_SESSIONS[i].address,
            CURRENT_SESSIONS[i].tokenId
          )
          .call()
      )
    )

    const sessionData: SessionData[] = _.map(
      _.range(0, CURRENT_SESSIONS.length),
      i => {
        return {
          img:
            pricingSessionMetadata[i].image_preview_url ||
            pricingSessionMetadata[i].image_url,
          endTime: Number(pricingSessionData[i].endTime) * 1000,
          numPpl: Number(pricingSessionData[i].uniqueVoters),
          title: pricingSessionMetadata[i].collection.name,
          totalStaked: Number(
            formatEther(pricingSessionData[i].totalSessionStake)
          ),
          nftName: pricingSessionMetadata[i].name,
          finalAppraisalValue:
            Number(statuses[i]) >= 4
              ? Number(finalAppraisalValues[i])
              : undefined,
          address: CURRENT_SESSIONS[i].address,
          tokenId: CURRENT_SESSIONS[i].tokenId,
          nonce: Number(pricingSessionNonce[i]),
          owner:
            pricingSessionMetadata[i].owner.user &&
            pricingSessionMetadata[i].owner.user.username
              ? pricingSessionMetadata[i].owner.user.username
              : shortenAddress(pricingSessionMetadata[i].owner.address),
        }
      }
    )
    dispatch(getMultipleSessionData(sessionData))
  }, [dispatch])
}

export const useGetCurrentSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const { account } = useActiveWeb3React()

  return useCallback(
    async (address: string, tokenId: string, nonce: number) => {
      const pricingSession = getPricingSessionContract(
        ABC_PRICING_SESSION_ADDRESS
      )

      let URL = `asset/${address}/${tokenId}`
      const [
        pricingSessionMetadata,
        pricingSessionData,
        ethUsd,
        getStatus,
        stateVals,
        finalAppraisalValue,
      ] = await Promise.all([
        openseaGet(URL),
        pricingSession.methods.NftSessionCore(nonce, address, tokenId).call(),
        axios.get(COINGECKO_ETH_USD),
        pricingSession.methods.getStatus(address, tokenId).call(),
        pricingSession.methods.NftSessionCheck(nonce, address, tokenId).call(),
        pricingSession.methods
          .finalAppraisalValue(nonce, address, tokenId)
          .call(),
      ])

      let sessionStatus = Number(getStatus)
      let endTime = Number(pricingSessionData.endTime) * 1000
      if (stateVals.finalAppraisalSet && sessionStatus === 4) {
        endTime =
          Number(stateVals.timeFinalAppraisalSet) * 1000 +
          Number(pricingSessionData.votingTime) * 1000
      } else if (stateVals.finalAppraisalSet && sessionStatus === 5) {
        endTime =
          Number(stateVals.timeFinalAppraisalSet) * 1000 +
          Number(pricingSessionData.votingTime) * 2 * 1000
      } else if (sessionStatus == 2) {
        endTime =
          endTime + Number(pricingSessionData.votingTime) * 1000
        const currentTime = Date.now()
        if (currentTime >= endTime) {
          sessionStatus = 3
        }
      }

      const sessionData: SessionData = {
        img:
          pricingSessionMetadata.image_url ||
          pricingSessionMetadata.image_preview_url,
        endTime,
        numPpl: Number(pricingSessionData.uniqueVoters),
        title: pricingSessionMetadata.collection.name,
        totalStaked: Number(formatEther(pricingSessionData.totalSessionStake)),
        totalStakedInUSD:
          Number(formatEther(pricingSessionData.totalSessionStake)) *
          Number(ethUsd.data.ethereum.usd),
        nftName: pricingSessionMetadata.name,
        address: address,
        tokenId: tokenId,
        nonce: nonce,
        finalAppraisalValue:
          sessionStatus >= 4 ? Number(finalAppraisalValue) : undefined,
        owner:
          pricingSessionMetadata.owner.user &&
          pricingSessionMetadata.owner.user.username
            ? pricingSessionMetadata.owner.user.username
            : shortenAddress(pricingSessionMetadata.owner.address),
      }

      const currentSessionData: CurrentSessionState = {
        sessionData,
        sessionStatus: sessionStatus,
      }
      dispatch(getCurrentSessionData(currentSessionData))
    },
    [dispatch, account]
  )
}

export const useGetUserStatus = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const { account } = useActiveWeb3React()

  return useCallback(
    async (address: string, tokenId: string) => {
      const pricingSession = getPricingSessionContract(
        ABC_PRICING_SESSION_ADDRESS
      )
      let getVoterCheck
      if (account) {
        getVoterCheck = await pricingSession.methods
          .getVoterCheck(address, tokenId, account)
          .call()
      } else {
        getVoterCheck = "-1"
      }
      dispatch(setUserStatus(Number(getVoterCheck)))
    },
    [dispatch, getPricingSessionContract, account]
  )
}

export const useCurrentSessionState = () => {
  return useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionStatus"]
  >(state => state.sessionData.currentSessionData.sessionStatus)
}

export const useCanUserInteract = () => {
  const sessionStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionStatus"]
  >(state => state.sessionData.currentSessionData.sessionStatus)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)

  switch (sessionStatus) {
    case SessionState.Vote:
      return (
        userStatus === UserState.NotVoted ||
        userStatus === UserState.CompletedVote
      )
    case SessionState.Weigh:
      return userStatus === UserState.CompletedVote
    case SessionState.SetFinalAppraisal:
      return true
    case SessionState.Harvest:
      return userStatus === UserState.CompletedWeigh
    case SessionState.Claim:
      return userStatus === UserState.CompletedHarvest
    case SessionState.EndSession:
      return userStatus === UserState.CompletedClaim
    case SessionState.Complete:
      return true
    default:
      return false
  }
}
