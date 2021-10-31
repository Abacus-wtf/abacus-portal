import React, { FunctionComponent } from "react"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import Vote from "./Vote"
import Weigh from "./Weigh"

const CurrentState: FunctionComponent = () => {
  const { state } = useCurrentSessionState()

  switch (state) {
    // case 0:
    //   return <Vote />
    case 0:
      return <Weigh />
    default:
      return null
  }
}

export default CurrentState
