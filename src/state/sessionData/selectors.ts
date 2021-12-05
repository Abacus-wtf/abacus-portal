import { initialState } from "@state/sessionData/reducer"
import { AppState } from "@state/index"
import { PromiseStatus } from "@models/PromiseStatus"

const defaultSessionData: AppState["sessionData"]["currentSessionData"]["sessionData"] =
  {
    animation_url: "",
    image_url: "",
    endTime: 0,
    numPpl: 0,
    collectionTitle: "None Selected",
    totalStaked: 0,
    nftName: "",
    address: "",
    tokenId: "",
    owner: "",
    ownerAddress: "",
    nonce: 0,
    maxAppraisal: 0,
    bounty: 0,
  }

export const multiSessionStateSelector = (
  state: AppState
): AppState["sessionData"]["multiSessionState"] =>
  state?.sessionData?.multiSessionState ?? initialState.multiSessionState

export const currentSessionDataSelector = (
  state: AppState
): AppState["sessionData"]["currentSessionData"]["sessionData"] =>
  state?.sessionData?.currentSessionData?.sessionData ?? defaultSessionData

export const currentSessionStatusSelector = (
  state: AppState
): AppState["sessionData"]["currentSessionData"]["sessionStatus"] =>
  state?.sessionData?.currentSessionData?.sessionStatus ?? -1

export const currentSessionFetchStatusSelector = (
  state: AppState
): AppState["sessionData"]["currentSessionData"]["fetchStatus"] =>
  state?.sessionData?.currentSessionData?.fetchStatus ?? PromiseStatus.Pending

export const currentSessionUserStatusSelector = (
  state: AppState
): AppState["sessionData"]["currentSessionData"]["userStatus"] =>
  state?.sessionData?.currentSessionData?.userStatus ?? -1

export const mySessionsStateSelector = (
  state: AppState
): AppState["sessionData"]["mySessionsState"] =>
  state.sessionData.mySessionsState

export const activeSessionsStateSelector = (
  state: AppState
): AppState["sessionData"]["activeSessionsState"] =>
  state.sessionData.activeSessionsState
