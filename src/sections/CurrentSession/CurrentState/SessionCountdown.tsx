import {
  useCurrentSessionData,
  useGetCurrentSessionData,
} from "@state/sessionData/hooks"
import React, { useContext } from "react"
import Countdown from "react-countdown"
import { ThemeContext } from "styled-components"
import { ListGroupItem } from "shards-react"
import { ListGroupHeader, ListGroupSubtext } from "@components/ListGroupMods"
import { Label } from "@components/global.styles"

interface SessionCountdownProps {
  overrideOnComplete?: () => void
  overrideEndTime?: number
  overrideTitle?: string
}

const SessionCountdown = ({
  overrideEndTime,
  overrideOnComplete,
  overrideTitle,
}: SessionCountdownProps) => {
  const sessionData = useCurrentSessionData()
  const theme = useContext(ThemeContext)
  const getCurrentSessionData = useGetCurrentSessionData()
  const endTime = overrideEndTime || sessionData.endTime
  return (
    <ListGroupItem style={{ width: "100%" }}>
      <Label>{overrideTitle || "Session ends in"}</Label>
      <Countdown
        date={endTime}
        onComplete={async () => {
          if (overrideOnComplete) {
            await overrideOnComplete()
          } else if (endTime) {
            await getCurrentSessionData(
              sessionData.address,
              sessionData.tokenId,
              sessionData.nonce
            )
          }
        }}
        renderer={({ hours, minutes, seconds, completed }) => {
          if (completed) {
            return <ListGroupHeader>Completed</ListGroupHeader>
          }
          const colon = (
            <ListGroupHeader
              style={{
                color: theme.colors.text2,
                margin: "0px 10px",
              }}
            >
              :
            </ListGroupHeader>
          )
          return (
            <div style={{ display: "flex" }}>
              <div>
                <ListGroupHeader>{hours}</ListGroupHeader>
                <ListGroupSubtext>Hr</ListGroupSubtext>
              </div>
              {colon}
              <div>
                <ListGroupHeader>{minutes}</ListGroupHeader>
                <ListGroupSubtext>Min</ListGroupSubtext>
              </div>
              {colon}
              <div>
                <ListGroupHeader>{seconds}</ListGroupHeader>
                <ListGroupSubtext>Sec</ListGroupSubtext>
              </div>
            </div>
          )
        }}
      />
    </ListGroupItem>
  )
}

SessionCountdown.defaultProps = {
  overrideOnComplete: null,
  overrideEndTime: null,
  overrideTitle: null,
}

export default SessionCountdown
