import React, { FunctionComponent } from "react"
import { useCurrentSessionStatus } from "@state/sessionData/hooks"
import { SessionState } from "@state/sessionData/reducer"
import Vote from "./Vote"
import Weigh from "./Weigh"
import SetFinalAppraisal from "./SetFinalAppraisal"
import Harvest from "./Harvest"
import Claim from "./Claim"
import SessionCompleted from "./SessionCompleted"

const CurrentState: FunctionComponent = () => {
  const status = useCurrentSessionStatus()
  switch (status) {
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
    case SessionState.Complete:
      return <SessionCompleted />
    default:
      return null
  }
}

export default CurrentState
