import { createReducer } from "@reduxjs/toolkit"
import { getMultipleSessionData, getCurrentSessionData } from "./actions"
import _ from "lodash"

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
  totalStakedInUSD?: number
}

interface SessionDataState {
  multiSessionData: SessionData[] | null
  currentSessionData: SessionData | null
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
