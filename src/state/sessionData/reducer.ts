import { createReducer } from '@reduxjs/toolkit'
import {
  getMultipleSessionData
} from './actions'
import _ from 'lodash'

export interface SessionData {
  img: any
  endTime: number
  numPpl: number
  title: string
  totalStaked: number
  nftName: string
  address: string
  tokenId: string
}

interface SessionDataState {
  multiSessionData: SessionData[] | null
}

export const initialState: SessionDataState = {
  multiSessionData: null
}

export default createReducer(initialState, builder =>
  builder
    .addCase(getMultipleSessionData, (state, action) => {
      state.multiSessionData = action.payload
    })
)
