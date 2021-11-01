import React, { FunctionComponent } from "react"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import {SessionState} from '@state/sessionData/reducer'
import Vote from "./Vote"
import Weigh from "./Weigh"

const CurrentState: FunctionComponent = () => {
  const state = useCurrentSessionState()

  switch (state) {
    case SessionState.Vote:
      return <Vote />
    case SessionState.Weigh:
      return <Weigh />
    default:
      return null
  }
}

export default CurrentState
