import { createAction } from "@reduxjs/toolkit"
import { AuctionData } from "./reducer"

export const setAuctionData = createAction<AuctionData>(
  "auctionData/setAuctionData"
)