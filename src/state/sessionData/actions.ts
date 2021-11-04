import { createAction } from "@reduxjs/toolkit"
import { SessionData, CurrentSessionState, ClaimState } from "./reducer"

export const getMultipleSessionData = createAction<SessionData[]>(
  "sessionData/getMultipleSessionData"
)
export const getCurrentSessionData = createAction<CurrentSessionState>(
  "sessionData/getCurrentSessionData"
)
export const setUserStatus = createAction<CurrentSessionState["userStatus"]>(
  "sessionData/setUserStatus"
)
export const setClaimPosition = createAction<ClaimState>(
  "sessionData/setClaimPosition"
)
