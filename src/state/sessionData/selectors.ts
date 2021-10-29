import { AppState } from "@state/index"

export const getCurrentSessionState = (state: AppState) =>
  state.sessionData.currentSessionData
