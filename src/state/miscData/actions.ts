import { createAction } from "@reduxjs/toolkit"
import { AuctionData, ClaimData } from "./reducer"

export const setAuctionData = createAction<AuctionData>(
  "miscData/setAuctionData"
)

export const setClaimData = createAction<ClaimData>("miscData/setClaimData")
