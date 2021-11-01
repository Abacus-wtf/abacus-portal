import React, { FunctionComponent } from "react"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import { SessionState } from "@state/sessionData/reducer"
import Vote from "./Vote"
import Weigh from "./Weigh"
import SetFinalAppraisal from "./SetFinalAppraisal"
import Harvest from "./Harvest"
import Claim from "./Claim"

const CurrentState: FunctionComponent = () => {
  const state = useCurrentSessionState()

  return <Claim />

  switch (state) {
    case SessionState.Vote:
      return <Vote />
    case SessionState.Weigh:
      return <Weigh />
    case SessionState.SetFinalAppraisal:
      return <SetFinalAppraisal />
    case SessionState.Harvest:
      return <Harvest />
    case SessionState.Claim:
      return <Claim />
    default:
      return null
  }
}

export default CurrentState
