import { initialState } from "@state/sessionData/reducer"
import { AppState } from "@state/index"

const defaultSessionData: AppState["sessionData"]["currentSessionData"]["sessionData"] = {
  img: "",
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

export const currentSessionUserStatusSelector = (
  state: AppState
): AppState["sessionData"]["currentSessionData"]["userStatus"] =>
  state?.sessionData?.currentSessionData?.userStatus ?? -1
