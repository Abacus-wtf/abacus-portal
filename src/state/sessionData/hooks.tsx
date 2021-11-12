import { useCallback } from "react"
import { AppState } from "@state/index"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import {
  setMultipleSessionData,
  setMultipleSessionFetchStatus,
  setMultipleSessionErrorMessage,
  getCurrentSessionData,
  setUserStatus,
  setClaimPosition,
} from "./actions"
import {
  SessionData,
  CurrentSessionState,
  UserState,
  SessionState,
  ClaimState,
} from "./reducer"
import { AppDispatch } from "../index"
import { useWeb3Contract, useActiveWeb3React } from "@hooks/index"
import {
  ABC_PRICING_SESSION_ADDRESS,
  CURRENT_SESSIONS,
  ETH_USD_ORACLE_ADDRESS,
} from "@config/constants"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import ETH_USD_ORACLE_ABI from "@config/contracts/ETH_USD_ORACLE_ABI.json"
import _ from "lodash"
import {
  openseaGet,
  openseaGetMany,
  OpenSeaGetResponse,
  shortenAddress,
} from "@config/utils"
import { formatEther } from "ethers/lib/utils"
import {
  currentSessionDataSelector,
  currentSessionStatusSelector,
  currentSessionUserStatusSelector,
  multiSessionStateSelector,
} from "./selectors"
import { PromiseStatus } from "@models/PromiseStatus"
import {
  GET_PRICING_SESSIONS,
  GetPricingSessionsQueryResponse,
  SubgraphPricingSession,
} from "./queries"

const GRAPHQL_ENDPOINT = process.env.SUBGRAPH_ENDPOINT

const modifyTimeAndSession = (
  getStatus: string,
  pricingSessionData: any,
  stateVals: any
) => {
  let sessionStatus = Number(getStatus)
  let endTime = Number(pricingSessionData.endTime) * 1000
  const currentTime = Date.now()
  if (sessionStatus === 3) {
    endTime =
      Number(stateVals.timeFinalAppraisalSet) * 1000 +
      Number(pricingSessionData.votingTime) * 1000
    if (currentTime >= endTime) {
      sessionStatus = 4
    }
  } else if (sessionStatus === 4) {
    endTime =
      Number(stateVals.timeFinalAppraisalSet) * 1000 +
      Number(pricingSessionData.votingTime) * 2 * 1000
  } else if (sessionStatus == 1) {
    endTime = endTime + Number(pricingSessionData.votingTime) * 1000
    if (currentTime >= endTime) {
      sessionStatus = 2
    }
  } else if (sessionStatus == 0 && currentTime > endTime) {
    sessionStatus = 1
    endTime = endTime + Number(pricingSessionData.votingTime) * 1000
  }
  return { endTime, sessionStatus }
}

export const useRetrieveClaimData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const sessionData = useCurrentSessionData()

  return useCallback(async () => {
    const pricingSession = getPricingSessionContract(
      ABC_PRICING_SESSION_ADDRESS
    )
    const [getEthPayout, ethToAbc] = await Promise.all([
      pricingSession.methods
        .getEthPayout(sessionData.address, sessionData.tokenId)
        .call(),
      pricingSession.methods.ethToAbc().call(),
    ])

    const claimData: ClaimState = {
      abcClaimAmount: Number(formatEther(getEthPayout * ethToAbc)),
      ethClaimAmount: Number(formatEther(getEthPayout)),
    }
    dispatch(setClaimPosition(claimData))
  }, [dispatch, sessionData])
}

const findAsset = (
  assets: OpenSeaGetResponse["assets"],
  session: SubgraphPricingSession
) => {
  const ret = assets.find(
    asset =>
      asset.asset_contract.address === session.nftAddress &&
      asset.token_id === String(session.tokenId)
  )

  return ret
}

export const useGetMultiSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(async () => {
    dispatch(setMultipleSessionFetchStatus(PromiseStatus.Pending))

    try {
      const {
        data: {
          data: { pricingSessions },
        },
      } = await axios.post<GetPricingSessionsQueryResponse>(
        GRAPHQL_ENDPOINT,
        {
          query: GET_PRICING_SESSIONS,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      //   // TODO: Make sure API works for more than 20 contracts
      let URL = `assets?${pricingSessions
        .map(session => `asset_contract_addresses=${session.nftAddress}&`)
        .toString()}${pricingSessions
        .map(session => `token_ids=${session.tokenId}&`)
        .toString()}`
      URL = URL.replaceAll(",", "")
      const { assets } = await openseaGetMany(URL)

      const sessionData: SessionData[] = _.map(
        pricingSessions,
        (session): SessionData => {
          const asset = findAsset(assets, session)
          return {
            img: asset.image_preview_url || asset.image_url,
            endTime: Number(session.endTime),
            numPpl: Number(session.numParticipants),
            collectionTitle: asset.asset_contract.name,
            totalStaked: Number(formatEther(session.totalStaked)),
            nftName: asset.name,
            finalAppraisalValue:
              session.sessionStatus >= 3
                ? Number(formatEther(session.finalAppraisalValue))
                : undefined,
            address: session.nftAddress,
            tokenId: session.tokenId,
            nonce: Number(session.nonce),
            ownerAddress: asset.owner?.address,
            owner:
              asset?.owner?.user && asset?.owner?.user?.username
                ? asset?.owner?.user?.username
                : shortenAddress(asset?.owner?.address),
            maxAppraisal: Number(session?.maxAppraisal),
          }
        }
      )
      dispatch(setMultipleSessionData(sessionData))
      dispatch(setMultipleSessionFetchStatus(PromiseStatus.Resolved))
    } catch {
      dispatch(setMultipleSessionFetchStatus(PromiseStatus.Rejected))
      dispatch(setMultipleSessionErrorMessage("Failed to get Session Data"))
    }
  }, [dispatch])
}

type GetUserStatusParams = {
  account: string
  getPricingSessionContract: ReturnType<typeof useWeb3Contract>
  address: string
  tokenId: string
}
const getUserStatus = async ({
  account,
  getPricingSessionContract,
  address,
  tokenId,
}: GetUserStatusParams) => {
  let getVoterCheck = -1
  const pricingSession = getPricingSessionContract(ABC_PRICING_SESSION_ADDRESS)
  if (account) {
    getVoterCheck = await pricingSession.methods
      .getVoterCheck(address, tokenId, account)
      .call()
  }
  return Number(getVoterCheck)
}

export const useGetCurrentSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const getEthUsdContract = useWeb3Contract(ETH_USD_ORACLE_ABI)
  const { account } = useActiveWeb3React()

  return useCallback(
    async (address: string, tokenId: string, nonce: number) => {
      const pricingSession = getPricingSessionContract(
        ABC_PRICING_SESSION_ADDRESS
      )
      const ethUsdOracle = getEthUsdContract(ETH_USD_ORACLE_ADDRESS)

      let URL = `asset/${address}/${tokenId}`
      const [
        pricingSessionMetadata,
        pricingSessionCore,
        getStatus,
        pricingSessionCheck,
        finalAppraisalValue,
      ] = await Promise.all([
        openseaGet(URL),
        pricingSession.methods.NftSessionCore(nonce, address, tokenId).call(),
        pricingSession.methods.getStatus(address, tokenId).call(),
        pricingSession.methods.NftSessionCheck(nonce, address, tokenId).call(),
        pricingSession.methods
          .finalAppraisalValue(nonce, address, tokenId)
          .call(),
      ])

      let ethUsd
      try {
        ethUsd = await ethUsdOracle.methods.latestRoundData().call()
        ethUsd = Number(ethUsd.answer) / 100000000
      } catch (e) {
        ethUsd = 4500
      }

      const { endTime, sessionStatus } = modifyTimeAndSession(
        getStatus,
        pricingSessionCore,
        pricingSessionCheck
      )
      const sessionData: SessionData = {
        img:
          pricingSessionMetadata?.image_url ||
          pricingSessionMetadata?.image_preview_url,
        endTime,
        numPpl: Number(pricingSessionCore.uniqueVoters),
        collectionTitle: pricingSessionMetadata?.collection?.name,
        totalStaked: Number(formatEther(pricingSessionCore.totalSessionStake)),
        totalStakedInUSD:
          Number(formatEther(pricingSessionCore.totalSessionStake)) *
          Number(ethUsd),
        nftName: pricingSessionMetadata?.name,
        address: address,
        tokenId: tokenId,
        nonce: nonce,
        finalAppraisalValue:
          sessionStatus >= 3
            ? Number(formatEther(finalAppraisalValue))
            : undefined,
        owner:
          pricingSessionMetadata?.owner?.user &&
          pricingSessionMetadata?.owner?.user?.username
            ? pricingSessionMetadata?.owner?.user?.username
            : shortenAddress(pricingSessionMetadata?.owner?.address),
        ownerAddress: pricingSessionMetadata?.owner?.address,
        maxAppraisal: Number(pricingSessionCore.maxAppraisal),
      }

      console.log(sessionData)

      const userStatus = await getUserStatus({
        address,
        account,
        getPricingSessionContract,
        tokenId,
      })

      const currentSessionData: CurrentSessionState = {
        sessionData,
        userStatus,
        sessionStatus: sessionStatus,
      }
      dispatch(getCurrentSessionData(currentSessionData))
    },
    [dispatch, account, getPricingSessionContract]
  )
}

export const useGetUserStatus = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const { account } = useActiveWeb3React()

  return useCallback(
    async (address: string, tokenId: string) => {
      const userStatus = await getUserStatus({
        address,
        account,
        getPricingSessionContract,
        tokenId,
      })
      dispatch(setUserStatus(userStatus))
    },
    [account, dispatch, getPricingSessionContract]
  )
}

export const useCurrentSessionStatus = () =>
  useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionStatus"]
  >(currentSessionStatusSelector)

export const useCurrentSessionData = () =>
  useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(currentSessionDataSelector)

export const useMultiSessionState = () =>
  useSelector<AppState, AppState["sessionData"]["multiSessionState"]>(
    multiSessionStateSelector
  )

export const useMultiSessionData = () =>
  useSelector<
    AppState,
    AppState["sessionData"]["multiSessionState"]["multiSessionData"]
  >(state => state.sessionData.multiSessionState.multiSessionData)

export const useCurrentSessionUserStatus = () =>
  useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(currentSessionUserStatusSelector)

export const useCanUserInteract = () => {
  const sessionStatus = useCurrentSessionStatus()
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
    case SessionState.Complete:
      return true
    default:
      return false
  }
}
