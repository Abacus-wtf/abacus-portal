import { useCallback } from "react"
import { AppState, AppDispatch } from "@state/index"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import {
  useWeb3Contract,
  useActiveWeb3React,
  useWeb3EthContract,
} from "@hooks/index"
import {
  ABC_PRICING_SESSION_ADDRESS,
  ETH_USD_ORACLE_ADDRESS,
  NetworkSymbolEnum,
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
import { PromiseStatus } from "@models/PromiseStatus"
import { useGetCurrentNetwork } from "@state/application/hooks"
import {
  GET_PRICING_SESSIONS,
  GetPricingSessionsQueryResponse,
  GetPricingSessionQueryResponse,
  SubgraphPricingSession,
  GET_PRICING_SESSION,
  GetActiveSessionsQueryResponse,
  GET_ACTIVE_SESSIONS,
  GetMySessionsQueryResponse,
  GET_MY_SESSIONS,
} from "./queries"
import {
  SessionData,
  CurrentSessionState,
  UserState,
  SessionState,
  ClaimState,
} from "./reducer"
import {
  setMultipleSessionData,
  setMultipleSessionFetchStatus,
  getCurrentSessionData,
  setUserStatus,
  setClaimPosition,
  setCurrentSessionFetchStatus,
  setCurrentSessionErrorMessage,
  setMySessionsFetchStatus,
  setActiveSessionsFetchStatus,
  setActiveSessionsData,
  setMySessionsData,
} from "./actions"
import {
  currentSessionDataSelector,
  currentSessionStatusSelector,
  currentSessionUserStatusSelector,
  multiSessionStateSelector,
  currentSessionFetchStatusSelector,
  mySessionsStateSelector,
  activeSessionsStateSelector,
} from "./selectors"

const GRAPHQL_ENDPOINT = process.env.GATSBY_APP_SUBGRAPH_ENDPOINT

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
  } else if (sessionStatus === 1) {
    endTime += Number(pricingSessionData.votingTime) * 1000
    if (currentTime >= endTime) {
      sessionStatus = 2
    }
  } else if (sessionStatus === 0 && currentTime > endTime) {
    sessionStatus = 1
    endTime += Number(pricingSessionData.votingTime) * 1000
  }
  return { endTime, sessionStatus }
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
export const useCurrentSessionFetchStatus = () =>
  useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["fetchStatus"]
  >(currentSessionFetchStatusSelector)

export const useMultiSessionData = () =>
  useSelector<
    AppState,
    AppState["sessionData"]["multiSessionState"]["multiSessionData"]
  >((state) => state.sessionData.multiSessionState.multiSessionData)

export const useMySessionsState = () =>
  useSelector<AppState, AppState["sessionData"]["mySessionsState"]>(
    mySessionsStateSelector
  )

export const useActiveSessionsState = () =>
  useSelector<AppState, AppState["sessionData"]["activeSessionsState"]>(
    activeSessionsStateSelector
  )

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
  >((state) => state.sessionData.currentSessionData.userStatus)

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

export const useRetrieveClaimData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const sessionData = useCurrentSessionData()
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(async () => {
    const pricingSession = getPricingSessionContract(
      ABC_PRICING_SESSION_ADDRESS(networkSymbol)
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
  }, [
    getPricingSessionContract,
    networkSymbol,
    sessionData.address,
    sessionData.tokenId,
    dispatch,
  ])
}

const findAsset = (
  assets: OpenSeaGetResponse["assets"],
  session: SubgraphPricingSession
) => {
  const ret = assets.find(
    (asset) =>
      asset.asset_contract.address === session.nftAddress &&
      asset.token_id === String(session.tokenId)
  )

  return ret
}

const parseSubgraphPricingSessions = async (
  pricingSessions: SubgraphPricingSession[]
) => {
  const { assets } = await openseaGetMany(pricingSessions)

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
        bounty: Number(formatEther(session.bounty)),
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
  return sessionData
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
      const sessionData = await parseSubgraphPricingSessions(pricingSessions)
      dispatch(setMultipleSessionData(sessionData))
      dispatch(setMultipleSessionFetchStatus(PromiseStatus.Resolved))
    } catch {
      dispatch(setMultipleSessionFetchStatus(PromiseStatus.Rejected))
    }
  }, [dispatch])
}

export const useGetMySessionsData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()

  return useCallback(async () => {
    if (!account) {
      return
    }
    dispatch(setMySessionsFetchStatus(PromiseStatus.Pending))

    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post<GetMySessionsQueryResponse>(
        GRAPHQL_ENDPOINT,
        {
          query: GET_MY_SESSIONS(account.toLowerCase()),
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      if (user) {
        const { creatorOf: pricingSessions } = user
        const sessionData = await parseSubgraphPricingSessions(pricingSessions)
        dispatch(setMySessionsData(sessionData))
      } else {
        dispatch(setMySessionsData([]))
      }
      dispatch(setMySessionsFetchStatus(PromiseStatus.Resolved))
    } catch {
      dispatch(setMySessionsFetchStatus(PromiseStatus.Rejected))
    }
  }, [dispatch, account])
}

export const useGetActiveSessionsData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()

  return useCallback(async () => {
    if (!account) {
      return
    }
    dispatch(setActiveSessionsFetchStatus(PromiseStatus.Pending))

    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post<GetActiveSessionsQueryResponse>(
        GRAPHQL_ENDPOINT,
        {
          query: GET_ACTIVE_SESSIONS(account.toLowerCase()),
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      if (user) {
        const { votes } = user
        const pricingSessions = _.map(votes, (i) => i.pricingSession)
        const sessionData = await parseSubgraphPricingSessions(pricingSessions)
        dispatch(setActiveSessionsData(sessionData))
      } else {
        dispatch(setActiveSessionsData([]))
      }
      dispatch(setActiveSessionsFetchStatus(PromiseStatus.Resolved))
    } catch {
      dispatch(setActiveSessionsFetchStatus(PromiseStatus.Rejected))
    }
  }, [dispatch, account])
}

type GetUserStatusParams = {
  account: string
  getPricingSessionContract: ReturnType<typeof useWeb3Contract>
  address: string
  tokenId: string
  networkSymbol: NetworkSymbolEnum
}
const getUserStatus = async ({
  account,
  getPricingSessionContract,
  address,
  tokenId,
  networkSymbol,
}: GetUserStatusParams) => {
  let getVoterCheck = -1
  const pricingSession = getPricingSessionContract(
    ABC_PRICING_SESSION_ADDRESS(networkSymbol)
  )
  if (account) {
    getVoterCheck = await pricingSession.methods
      .getVoterCheck(address, tokenId, account)
      .call()
  }
  return Number(getVoterCheck)
}

export const useGetCurrentSessionDataGRT = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const getEthUsdContract = useWeb3Contract(ETH_USD_ORACLE_ABI)
  const { account } = useActiveWeb3React()
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(
    async (address: string, tokenId: string, nonce: number) => {
      dispatch(setCurrentSessionFetchStatus(PromiseStatus.Pending))
      const ethUsdOracle = getEthUsdContract(ETH_USD_ORACLE_ADDRESS)
      try {
        const URL = `asset/${address}/${tokenId}`
        const [data, asset] = await Promise.all([
          axios.post<GetPricingSessionQueryResponse>(
            GRAPHQL_ENDPOINT,
            {
              query: GET_PRICING_SESSION(`${address}/${tokenId}/${nonce}`),
            },
            {
              headers: {
                "content-type": "application/json",
              },
            }
          ),
          openseaGet(URL),
        ])
        const { pricingSession } = data.data.data

        let ethUsd
        try {
          ethUsd = await ethUsdOracle.methods.latestRoundData().call()
          ethUsd = Number(ethUsd.answer) / 100000000
        } catch (e) {
          ethUsd = 4500
        }

        const { endTime, sessionStatus } = modifyTimeAndSession(
          `${pricingSession.sessionStatus}`,
          pricingSession,
          pricingSession
        )

        const sessionData: SessionData = {
          img: asset.image_preview_url || asset.image_url,
          endTime: Number(endTime),
          numPpl: Number(pricingSession.numParticipants),
          collectionTitle: asset.asset_contract.name,
          totalStaked: Number(formatEther(pricingSession.totalStaked)),
          totalStakedInUSD:
            Number(formatEther(pricingSession.totalStaked)) * ethUsd,
          bounty: Number(formatEther(pricingSession.bounty)),
          nftName: asset.name,
          finalAppraisalValue:
            sessionStatus >= 3
              ? Number(formatEther(pricingSession.finalAppraisalValue))
              : undefined,
          address: pricingSession.nftAddress,
          tokenId: pricingSession.tokenId,
          nonce: Number(pricingSession.nonce),
          ownerAddress: asset.owner?.address,
          owner:
            asset?.owner?.user && asset?.owner?.user?.username
              ? asset?.owner?.user?.username
              : shortenAddress(asset?.owner?.address),
          maxAppraisal: Number(pricingSession?.maxAppraisal),
        }

        const userStatus = await getUserStatus({
          address,
          account,
          getPricingSessionContract,
          tokenId,
          networkSymbol,
        })

        const currentSessionData: CurrentSessionState = {
          sessionData,
          userStatus,
          sessionStatus,
        }
        dispatch(getCurrentSessionData(currentSessionData))
        dispatch(setCurrentSessionFetchStatus(PromiseStatus.Resolved))
      } catch (e) {
        dispatch(setCurrentSessionFetchStatus(PromiseStatus.Rejected))
        dispatch(setCurrentSessionErrorMessage("Failed to get Session Data"))
      }
    },
    [
      account,
      dispatch,
      getEthUsdContract,
      getPricingSessionContract,
      networkSymbol,
    ]
  )
}

export const useGetCurrentSessionData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const getEthUsdContract = useWeb3EthContract(ETH_USD_ORACLE_ABI)
  const networkSymbol = useGetCurrentNetwork()
  const { account } = useActiveWeb3React()

  return useCallback(
    async (address: string, tokenId: string, nonce: number) => {
      const pricingSession = getPricingSessionContract(
        ABC_PRICING_SESSION_ADDRESS(networkSymbol)
      )
      const ethUsdOracle = getEthUsdContract(ETH_USD_ORACLE_ADDRESS)

      const URL = `asset/${address}/${tokenId}`
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
        bounty: Number(formatEther(pricingSessionCore.bounty)),
        totalStakedInUSD:
          Number(formatEther(pricingSessionCore.totalSessionStake)) *
          Number(ethUsd),
        nftName: pricingSessionMetadata?.name,
        address,
        tokenId,
        nonce,
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

      const userStatus = await getUserStatus({
        address,
        account,
        getPricingSessionContract,
        tokenId,
        networkSymbol,
      })

      const currentSessionData: CurrentSessionState = {
        sessionData,
        userStatus,
        sessionStatus,
      }
      dispatch(getCurrentSessionData(currentSessionData))
    },
    [
      getPricingSessionContract,
      networkSymbol,
      getEthUsdContract,
      account,
      dispatch,
    ]
  )
}

export const useGetUserStatus = () => {
  const dispatch = useDispatch<AppDispatch>()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const { account } = useActiveWeb3React()
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(
    async (address: string, tokenId: string) => {
      const userStatus = await getUserStatus({
        address,
        account,
        getPricingSessionContract,
        tokenId,
        networkSymbol,
      })
      dispatch(setUserStatus(userStatus))
    },
    [account, dispatch, getPricingSessionContract, networkSymbol]
  )
}
