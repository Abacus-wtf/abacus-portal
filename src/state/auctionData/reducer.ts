import { createReducer } from "@reduxjs/toolkit"
import { setAuctionData } from "./actions"
import _ from "lodash"

interface OptionalAuctionInfo {
  img: any
  highestNftAddress: string
  highestNftTokenId: string
  highestBidderAddress: string
  highestNftCollectionTitle: string
  highestNftName: string
}

export interface AuctionData {
  endTime: number
  highestBid: number
  highestBidDollars: number
  optionalInfo?: OptionalAuctionInfo
}

interface AuctionState {
  auctionData: AuctionData | null
}

export const initialState: AuctionState = {
  auctionData: null,
}

export default createReducer(initialState, builder =>
  builder.addCase(setAuctionData, (state, action) => {
    state.auctionData = action.payload
  })
)
