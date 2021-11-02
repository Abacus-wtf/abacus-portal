import React, { FunctionComponent } from "react"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import { SessionState } from "@state/sessionData/reducer"
import Vote from "./Vote"
import Weigh from "./Weigh"
import SetFinalAppraisal from "./SetFinalAppraisal"
import Harvest from "./Harvest"
import Claim from "./Claim"
import EndSession from "./EndSession"

const CurrentState: FunctionComponent = () => {
  const state = useCurrentSessionState()

  switch (state) {
    case SessionState.Vote:
      return <Vote />
    case SessionState.Weigh:
      return <Weigh />
    case SessionState.SetFinalAppraisal:
      return <Vote />
    case SessionState.Harvest:
      return <Harvest />
    case SessionState.Claim:
      return <Claim />
    case SessionState.EndSession:
      return <EndSession />
    default:
      return null
  }
}

export default CurrentState
