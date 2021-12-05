import { createReducer } from "@reduxjs/toolkit"
import { setAuctionData, setClaimData } from "./actions"

interface OptionalAuctionInfo {
  image_url: string
  animation_url: string | null
  highestNftAddress: string
  highestNftTokenId: string
  highestBidderAddress: string
  highestNftCollectionTitle: string
  highestNftName: string
}

export interface ExistingBidInfo {
  bid: string
  nftAddress: string
  tokenId: string
  initialAppraisal: string
}

export interface AuctionData {
  endTime: number
  highestBid: number
  highestBidDollars: number
  optionalInfo?: OptionalAuctionInfo
  existingBidInfo?: ExistingBidInfo
}

export interface ClaimData {
  ethPayout: number
  abcPayout: number
  ethCredit: number
}

interface AuctionState {
  auctionData: AuctionData | null
  claimPayoutData: ClaimData | null
}

export const initialState: AuctionState = {
  auctionData: null,
  claimPayoutData: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setAuctionData, (state, action) => {
      state.auctionData = action.payload
    })
    .addCase(setClaimData, (state, action) => {
      state.claimPayoutData = action.payload
    })
)
