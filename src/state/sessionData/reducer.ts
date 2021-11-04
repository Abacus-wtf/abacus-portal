import { createReducer } from "@reduxjs/toolkit"
import {
  getMultipleSessionData,
  getCurrentSessionData,
  setUserStatus,
} from "./actions"
import _ from "lodash"

export enum SessionState {
  Vote = 0,
  Weigh = 1,
  SetFinalAppraisal = 2,
  Harvest = 3,
  Claim = 4,
  EndSession = 5,
  Complete = 6,
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

export interface CurrentSessionState {
  sessionData: SessionData
  sessionStatus: SessionState
  userStatus: UserState
}

interface SessionDataState {
  multiSessionData: SessionData[] | null
  currentSessionData: CurrentSessionState | null
}

export const initialState: SessionDataState = {
  multiSessionData: null,
  currentSessionData: null,
}

export default createReducer(initialState, builder =>
  builder
    .addCase(getMultipleSessionData, (state, action) => {
      state.multiSessionData = action.payload
    })
    .addCase(getCurrentSessionData, (state, action) => {
      state.currentSessionData = action.payload
    })
    .addCase(setUserStatus, (state, action) => {
      state.currentSessionData.userStatus = action.payload
    })
)
