import { PromiseStatus } from "@models/PromiseStatus"
import { createAction } from "@reduxjs/toolkit"
import { SessionData, CurrentSessionState, ClaimState } from "./reducer"

export const setMultipleSessionData = createAction<SessionData[]>(
  "sessionData/setMultipleSessionData"
)
export const setMultipleSessionFetchStatus = createAction<PromiseStatus>(
  "sessionData/setMultipleSessionFetchStatus"
)
export const setMultipleSessionErrorMessage = createAction<string>(
  "sessionData/setMultipleSessionErrorMessage"
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
