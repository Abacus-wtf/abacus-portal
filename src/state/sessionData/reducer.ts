import { createReducer } from "@reduxjs/toolkit"
import { getMultipleSessionData, getCurrentSessionData } from "./actions"
import _ from "lodash"

export enum SessionState {
  Vote = 1,
  Weigh = 2,
  SetFinalAppraisal = 3,
  Harvest = 4,
  Claim = 5,
  EndSession = 6,
  Complete = 7,
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
  title: string
  totalStaked: number
  nftName: string
  address: string
  tokenId: string
  owner: string
  nonce: number
  totalStakedInUSD?: number
  state: number
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
)
