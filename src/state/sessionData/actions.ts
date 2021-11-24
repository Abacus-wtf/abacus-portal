import { PromiseStatus } from "@models/PromiseStatus"
import { createAction } from "@reduxjs/toolkit"
import { SessionData, CurrentSessionState, ClaimState } from "./reducer"

export const setCurrentSessionFetchStatus = createAction<PromiseStatus>(
  "sessionData/setCurrentSessionFetchStatus"
)
export const setCurrentSessionErrorMessage = createAction<string>(
  "sessionData/setCurrentSessionErrorMessage"
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
export const setMultipleSessionData = createAction<SessionData[]>(
  "sessionData/setMultipleSessionData"
)
export const setMultipleSessionFetchStatus = createAction<PromiseStatus>(
  "sessionData/setMultipleSessionFetchStatus"
)
export const setMultipleSessionErrorMessage = createAction<string | null>(
  "sessionData/setMultipleSessionErrorMessage"
)
export const setMySessionsData = createAction<SessionData[]>(
  "sessionData/mySessionsState/setMySessionsData"
)
export const setMySessionsFetchStatus = createAction<PromiseStatus>(
  "sessionData/mySessionsState/setMySessionsFetchStatus"
)
export const setMySessionsErrorMessage = createAction<string | null>(
  "sessionData/mySessionsState/setMySessionsErrorMessage"
)
export const setActiveSessionsData = createAction<SessionData[]>(
  "sessionData/activeSessionsState/setActiveSessionsData"
)
export const setActiveSessionsFetchStatus = createAction<PromiseStatus>(
  "sessionData/activeSessionsState/setActiveSessionsFetchStatus"
)
export const setActiveSessionsErrorMessage = createAction<string | null>(
  "sessionData/activeSessionsState/setActiveSessionsErrorMessage"
)
