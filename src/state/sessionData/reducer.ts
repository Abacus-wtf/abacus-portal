import { createReducer } from "@reduxjs/toolkit"
import {
  getCurrentSessionData,
  setUserStatus,
  setClaimPosition,
  setMultipleSessionData,
  setMultipleSessionFetchStatus,
  setMultipleSessionErrorMessage,
  setCurrentSessionFetchStatus,
  setCurrentSessionErrorMessage,
  setMySessionsData,
  setMySessionsFetchStatus,
  setMySessionsErrorMessage,
  setActiveSessionsData,
  setActiveSessionsFetchStatus,
  setActiveSessionsErrorMessage,
} from "./actions"
import _ from "lodash"
import { PromiseStatus } from "@models/PromiseStatus"

export enum SessionState {
  Vote = 0,
  Weigh = 1,
  SetFinalAppraisal = 2,
  Harvest = 3,
  Claim = 4,
  Complete = 5,
}

export enum UserState {
  NotLoggedIn = -1,
  NotVoted = 0,
  CompletedVote = 1,
  CompletedWeigh = 2,
  CompletedHarvest = 3,
  CompletedClaim = 4,
}

export interface SessionData {
  img: any
  endTime: number
  numPpl: number
  collectionTitle: string
  totalStaked: number
  bounty: number
  nftName: string
  address: string
  tokenId: string
  owner: string
  ownerAddress: string
  nonce: number
  maxAppraisal: number
  finalAppraisalValue?: number
  totalStakedInUSD?: number
}

export interface ClaimState {
  ethClaimAmount: number
  abcClaimAmount: number
}

export interface CurrentSessionState {
  sessionData: SessionData
  sessionStatus: SessionState
  userStatus: UserState
  claimPositions?: ClaimState
  fetchStatus?: PromiseStatus
  errorMessage?: string | null
}

export interface MultiSessionState {
  multiSessionData: SessionData[] | null
  fetchStatus: PromiseStatus
  errorMessage: string | null
}

export interface MySessionsState {
  mySessionsData: SessionData[]
  fetchStatus: PromiseStatus
  errorMessage: string | null
}

export interface ActiveSessionsState {
  activeSessionsData: SessionData[]
  fetchStatus: PromiseStatus
  errorMessage: string | null
}

interface SessionDataState {
  currentSessionData: CurrentSessionState | null
  multiSessionState: MultiSessionState
  mySessionsState: MySessionsState
  activeSessionsState: ActiveSessionsState
}

export const initialState = {
  currentSessionData: null,
  multiSessionState: {
    multiSessionData: [],
    fetchStatus: PromiseStatus.Idle,
    errorMessage: null,
  },
  mySessionsState: {
    mySessionsData: [],
    fetchStatus: PromiseStatus.Idle,
    errorMessage: null,
  },
  activeSessionsState: {
    activeSessionsData: [],
    fetchStatus: PromiseStatus.Idle,
    errorMessage: null,
  },
} as SessionDataState

export default createReducer(initialState, builder =>
  builder
    .addCase(getCurrentSessionData, (state, action) => {
      state.currentSessionData = action.payload
    })
    .addCase(setUserStatus, (state, action) => {
      state.currentSessionData.userStatus = action.payload
    })
    .addCase(setClaimPosition, (state, action) => {
      state.currentSessionData.claimPositions = action.payload
    })
    .addCase(setCurrentSessionFetchStatus, (state, action) => {
      if (state.currentSessionData !== null) {
        state.currentSessionData.fetchStatus = action.payload
      }
    })
    .addCase(setCurrentSessionErrorMessage, (state, action) => {
      if (state.currentSessionData !== null) {
        state.currentSessionData.errorMessage = action.payload
      }
    })
    .addCase(setMultipleSessionData, (state, action) => {
      state.multiSessionState.multiSessionData = action.payload
    })
    .addCase(setMultipleSessionFetchStatus, (state, action) => {
      state.multiSessionState.fetchStatus = action.payload
    })
    .addCase(setMultipleSessionErrorMessage, (state, action) => {
      state.multiSessionState.errorMessage = action.payload
    })
    .addCase(setMySessionsData, (state, action) => {
      state.mySessionsState.mySessionsData = action.payload
    })
    .addCase(setMySessionsFetchStatus, (state, action) => {
      state.mySessionsState.fetchStatus = action.payload
    })
    .addCase(setMySessionsErrorMessage, (state, action) => {
      state.mySessionsState.errorMessage = action.payload
    })
    .addCase(setActiveSessionsData, (state, action) => {
      state.activeSessionsState.activeSessionsData = action.payload
    })
    .addCase(setActiveSessionsFetchStatus, (state, action) => {
      state.activeSessionsState.fetchStatus = action.payload
    })
    .addCase(setActiveSessionsErrorMessage, (state, action) => {
      state.activeSessionsState.errorMessage = action.payload
    })
)
