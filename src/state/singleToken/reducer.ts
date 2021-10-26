import { createReducer } from '@reduxjs/toolkit'
import {
  setSingleTokenMetadata
} from './actions'
import _ from 'lodash'

export interface Token {
  img: any
  name: string
  symbol: string
  address: string
  marketCap: number
  volume: number
  price: number
  supply: number
}

interface TokenState {
  metadata?: Token
}

export const initialState: TokenState = {}

export default createReducer(initialState, builder =>
  builder
    .addCase(setSingleTokenMetadata, (state, action) => {
      state.metadata = action.payload
    })
)
