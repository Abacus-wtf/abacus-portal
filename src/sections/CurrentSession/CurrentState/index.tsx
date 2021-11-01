import React, { FunctionComponent } from "react"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import { SessionState } from "@state/sessionData/reducer"
import Vote from "./Vote"
import Weigh from "./Weigh"
import SetFinalAppraisal from "./SetFinalAppraisal"
import Harvest from "./Harvest"

const CurrentState: FunctionComponent = () => {
  const state = useCurrentSessionState()

  return <Harvest />

  switch (state) {
    case SessionState.Vote:
      return <Vote />
    case SessionState.Weigh:
      return <Weigh />
    case SessionState.SetFinalAppraisal:
      return <SetFinalAppraisal />
    case SessionState.Harvest:
      return <Harvest />
    default:
      return null
  }
}

export default CurrentState