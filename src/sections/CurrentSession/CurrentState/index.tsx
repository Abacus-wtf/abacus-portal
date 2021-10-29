import React, { FunctionComponent } from "react"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import Vote from "./Vote"

const CurrentState: FunctionComponent = () => {
  const { state } = useCurrentSessionState()

  switch (state) {
    case 0:
      return <Vote />
    default:
      return null
  }
}

export default CurrentState
