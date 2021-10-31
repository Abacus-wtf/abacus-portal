import { createAction } from "@reduxjs/toolkit"
import { SessionData, CurrentSessionState } from "./reducer"

export const getMultipleSessionData = createAction<SessionData[]>(
  "sessionData/getMultipleSessionData"
)
export const getCurrentSessionData = createAction<CurrentSessionState>(
  "sessionData/getCurrentSessionData"
)
