import { useCallback, useRef } from "react"
import { AppState, AppDispatch } from "@state/index"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { request } from "graphql-request"
import {
  useWeb3Contract,
  useActiveWeb3React,
  useWeb3EthContract,
} from "@hooks/index"
import {
  ABC_PRICING_SESSION_ADDRESS,
  ARB_LEGACY_GRAPHS,
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
  setMultipleSessionPage,
  setMultipleSessionIsLastPage,
  setMySessionsPage,
  setMySessionsIsLastPage,
  setActiveSessionsPage,
  setActiveSessionsIsLastPage,
} from "./actions"
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
  GetPricingSessionsVariables,
  GetMySessionsVariables,
  GetActiveSessionsVariables,
} from "./queries"
import { PAGINATE_BY } from "./constants"
import {
  currentSessionDataSelector,
  currentSessionStatusSelector,
  currentSessionUserStatusSelector,
  multiSessionStateSelector,
  currentSessionFetchStatusSelector,
  mySessionsStateSelector,
  activeSessionsStateSelector,
} from "./selectors"

const GRAPHQL_ENDPOINT = (
  networkSymbol: NetworkSymbolEnum,
  isLegacy = false
): string => {
  if (isLegacy) {
    return ARB_LEGACY_GRAPHS
  }

  switch (networkSymbol) {
    case NetworkSymbolEnum.ETH:
      return process.env.GATSBY_APP_SUBGRAPH_ENDPOINT_ETH
    case NetworkSymbolEnum.ARBITRUM:
      return process.env.GATSBY_APP_SUBGRAPH_ENDPOINT_ARBITRUM
    default:
      return ""
  }
}

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

    if (currentTime >= endTime) {
      sessionStatus = 5
    }
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
    const [getEthPayout, ethToAbc, core] = await Promise.all([
      pricingSession.methods
        .getEthPayout(sessionData.address, sessionData.tokenId)
        .call(),
      pricingSession.methods.ethToAbc().call(),
      pricingSession.methods
        .NftSessionCore(
          sessionData.nonce,
          sessionData.address,
          sessionData.tokenId
        )
        .call(),
    ])

    const claimData: ClaimState = {
      abcClaimAmount: Number(formatEther(getEthPayout * ethToAbc)),
      ethClaimAmount: Number(formatEther(getEthPayout)),
      totalProfit: Number(formatEther(core.totalProfit)),
    }
    dispatch(setClaimPosition(claimData))
  }, [
    getPricingSessionContract,
    networkSymbol,
    sessionData.address,
    sessionData.tokenId,
    sessionData.nonce,
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
        image_url: asset.image_preview_url || asset.image_url,
        animation_url: null,
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
        maxAppraisal: Number(formatEther(session?.maxAppraisal)),
      }
    }
  )
  return sessionData
}

export const useGetMultiSessionData = (isLegacy = false) => {
  const dispatch = useDispatch<AppDispatch>()
  const whereRef = useRef("")
  const { page, multiSessionData } = useMultiSessionState()
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(
    async (where: string | null) => {
      if (!networkSymbol) {
        return
      }
      let currentPage = page
      let currentData = multiSessionData
      if (where !== whereRef.current) {
        currentPage = 0
        currentData = []
        dispatch(setMultipleSessionData([]))
      }
      whereRef.current = where
      dispatch(setMultipleSessionFetchStatus(PromiseStatus.Pending))
      const variables: GetPricingSessionsVariables = {
        first: PAGINATE_BY,
        skip: currentPage * PAGINATE_BY,
      }
      console.log(GRAPHQL_ENDPOINT(networkSymbol, isLegacy))
      try {
        const { pricingSessions } =
          await request<GetPricingSessionsQueryResponse>(
            GRAPHQL_ENDPOINT(networkSymbol, isLegacy),
            GET_PRICING_SESSIONS(where),
            variables
          )
        const sessionData = await parseSubgraphPricingSessions(pricingSessions)
        const isLastPage = sessionData.length < PAGINATE_BY
        dispatch(setMultipleSessionData([...currentData, ...sessionData]))
        dispatch(setMultipleSessionPage(currentPage + 1))
        dispatch(setMultipleSessionIsLastPage(isLastPage))
        dispatch(setMultipleSessionFetchStatus(PromiseStatus.Resolved))
      } catch {
        dispatch(setMultipleSessionFetchStatus(PromiseStatus.Rejected))
      }
    },
    [dispatch, page, multiSessionData, networkSymbol, isLegacy]
  )
}

export const useGetMySessionsData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const whereRef = useRef(null)
  const { account } = useActiveWeb3React()
  const { page, data } = useMySessionsState()
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(
    async (where: string | null) => {
      if (!account || !networkSymbol) {
        return
      }
      dispatch(setMySessionsFetchStatus(PromiseStatus.Pending))
      let currentPage = page
      let currentData = data
      if (where !== whereRef.current) {
        currentPage = 0
        currentData = []
        dispatch(setMySessionsData(currentData))
      }
      whereRef.current = where
      const variables: GetMySessionsVariables = {
        userId: account.toLowerCase(),
        first: PAGINATE_BY,
        skip: currentPage * PAGINATE_BY,
      }

      try {
        const { user } = await request<GetMySessionsQueryResponse>(
          GRAPHQL_ENDPOINT(networkSymbol),
          GET_MY_SESSIONS(where),
          variables
        )
        if (user) {
          const { creatorOf: pricingSessions } = user
          const sessionData = await parseSubgraphPricingSessions(
            pricingSessions
          )
          const isLastPage = sessionData.length < PAGINATE_BY
          dispatch(setMySessionsData([...currentData, ...sessionData]))
          dispatch(setMySessionsPage(currentPage + 1))
          dispatch(setMySessionsIsLastPage(isLastPage))
        } else {
          dispatch(setMySessionsData([]))
          dispatch(setMySessionsPage(0))
          dispatch(setMySessionsIsLastPage(true))
        }
        dispatch(setMySessionsFetchStatus(PromiseStatus.Resolved))
      } catch {
        dispatch(setMySessionsFetchStatus(PromiseStatus.Rejected))
      }
    },
    [dispatch, account, page, data, networkSymbol]
  )
}

export const useGetActiveSessionsData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()
  const whereRef = useRef(null)
  const { page, data } = useActiveSessionsState()
  const networkSymbol = useGetCurrentNetwork()

  return useCallback(
    async (where: string | null) => {
      if (!account || !networkSymbol) {
        return
      }
      dispatch(setActiveSessionsFetchStatus(PromiseStatus.Pending))
      let currentPage = page
      let currentData = data
      if (where !== whereRef.current) {
        currentPage = 0
        currentData = []
        dispatch(setActiveSessionsData(currentData))
      }
      whereRef.current = where
      const variables: GetActiveSessionsVariables = {
        userId: account.toLowerCase(),
        first: PAGINATE_BY,
        skip: currentPage * PAGINATE_BY,
      }

      try {
        const { user } = await request<GetActiveSessionsQueryResponse>(
          GRAPHQL_ENDPOINT(networkSymbol),
          GET_ACTIVE_SESSIONS(where),
          variables
        )
        if (user) {
          const { pricingSessionsVotedIn } = user
          const sessionData = await parseSubgraphPricingSessions(
            pricingSessionsVotedIn
          )
          const isLastPage = sessionData.length < PAGINATE_BY
          dispatch(setActiveSessionsData([...currentData, ...sessionData]))
          dispatch(setActiveSessionsPage(currentPage + 1))
          dispatch(setActiveSessionsIsLastPage(isLastPage))
        } else {
          dispatch(setActiveSessionsData([]))
          dispatch(setActiveSessionsPage(0))
          dispatch(setActiveSessionsIsLastPage(true))
        }
        dispatch(setActiveSessionsFetchStatus(PromiseStatus.Resolved))
      } catch {
        dispatch(setActiveSessionsFetchStatus(PromiseStatus.Rejected))
      }
    },
    [dispatch, account, page, data, networkSymbol]
  )
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

export const useGetCurrentSessionDataGRT = (isLegacy = false) => {
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
            GRAPHQL_ENDPOINT(networkSymbol, isLegacy),
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

        let guessedAppraisal = -1
        if (sessionStatus >= SessionState.Harvest && account) {
          const index = _.findIndex(
            pricingSession.participants,
            (participant) => participant.user.id === account.toLowerCase()
          )
          if (index !== -1) {
            guessedAppraisal = Number(
              formatEther(pricingSession.participants[index].appraisal)
            )
          }
        }

        const sessionData: SessionData = {
          image_url: asset.image_preview_url || asset.image_url,
          animation_url: asset.animation_url || null,
          endTime: Number(endTime),
          numPpl: Number(pricingSession.numParticipants),
          collectionTitle: asset.asset_contract.name,
          totalStaked: Number(formatEther(pricingSession.totalStaked)),
          totalStakedInUSD:
            Number(formatEther(pricingSession.totalStaked)) * Number(ethUsd),
          bountyInUSD:
            Number(formatEther(pricingSession.bounty)) * Number(ethUsd),
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
          maxAppraisal: Number(formatEther(pricingSession?.maxAppraisal)),
          guessedAppraisal,
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
      isLegacy,
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
    async (
      address: string,
      tokenId: string,
      nonce: number,
      isLegacy = false
    ) => {
      dispatch(setCurrentSessionFetchStatus(PromiseStatus.Pending))
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
        finalAppraisalResult,
        grtData,
      ] = await Promise.all([
        openseaGet(URL),
        pricingSession.methods.NftSessionCore(nonce, address, tokenId).call(),
        pricingSession.methods.getStatus(address, tokenId).call(),
        pricingSession.methods.NftSessionCheck(nonce, address, tokenId).call(),
        pricingSession.methods
          .finalAppraisalValue(nonce, address, tokenId)
          .call(),
        axios.post<GetPricingSessionQueryResponse>(
          GRAPHQL_ENDPOINT(networkSymbol, isLegacy),
          {
            query: GET_PRICING_SESSION(`${address}/${tokenId}/${nonce}`),
          },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        ),
      ])
      const { pricingSession: pricingSessionGrt } = grtData.data.data

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

      const finalAppraisalValue =
        sessionStatus >= 3
          ? Number(formatEther(finalAppraisalResult))
          : undefined

      let guessedAppraisal = -1
      if (sessionStatus >= SessionState.Harvest && account) {
        const index = _.findIndex(
          pricingSessionGrt.participants,
          (participant) => participant.user.id === account.toLowerCase()
        )
        if (index !== -1) {
          guessedAppraisal = Number(
            formatEther(pricingSessionGrt.participants[index].appraisal)
          )
        }
      }

      let rankings
      if (sessionStatus >= SessionState.Weigh) {
        rankings = _.map(
          pricingSessionGrt !== null ? pricingSessionGrt.participants : [],
          (vote) => ({
            ...vote,
            appraisal: formatEther(vote.appraisal),
            amountStaked: formatEther(vote.amountStaked),
          })
        )
      }

      if (finalAppraisalValue !== undefined) {
        rankings = rankings.sort((a, b) => {
          const aVal = Number(a.appraisal)
          const bVal = Number(b.appraisal)
          if (aVal === 0) return 10000000
          if (bVal === 0) return -10000000
          return (
            Math.abs(finalAppraisalValue - aVal) -
            Math.abs(finalAppraisalValue - bVal)
          )
        })
      }

      const sessionData: SessionData = {
        rankings,
        bounty: Number(formatEther(pricingSessionCore.bounty)),
        image_url:
          pricingSessionMetadata?.image_url ||
          pricingSessionMetadata?.image_preview_url,
        animation_url: pricingSessionMetadata?.animation_url || null,
        endTime,
        guessedAppraisal,
        numPpl:
          sessionStatus >= 2
            ? Number(pricingSessionGrt.numParticipants)
            : Number(pricingSessionCore.uniqueVoters),
        collectionTitle: pricingSessionMetadata?.collection?.name,
        totalStaked:
          sessionStatus >= 2
            ? Number(formatEther(pricingSessionGrt.totalStaked))
            : Number(formatEther(pricingSessionCore.totalSessionStake)),
        totalStakedInUSD:
          sessionStatus >= 2
            ? Number(formatEther(pricingSessionGrt.totalStaked)) *
              Number(ethUsd)
            : Number(formatEther(pricingSessionCore.totalSessionStake)) *
              Number(ethUsd),
        bountyInUSD:
          Number(formatEther(pricingSessionCore.bounty)) * Number(ethUsd),
        nftName: pricingSessionMetadata?.name,
        address,
        tokenId,
        nonce,
        finalAppraisalValue,
        owner:
          pricingSessionMetadata?.owner?.user &&
          pricingSessionMetadata?.owner?.user?.username
            ? pricingSessionMetadata?.owner?.user?.username
            : shortenAddress(pricingSessionMetadata?.owner?.address),
        ownerAddress: pricingSessionMetadata?.owner?.address,
        maxAppraisal: Number(formatEther(pricingSessionCore.maxAppraisal)),
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
