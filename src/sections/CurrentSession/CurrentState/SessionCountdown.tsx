import { useCurrentSessionState } from "@state/sessionData/hooks"
import React, { FunctionComponent, useContext } from "react"
import Countdown from "react-countdown"
import { ThemeContext } from "styled-components"
import { ListGroupItem } from "shards-react"
import { ListGroupHeader, ListGroupSubtext } from "@components/ListGroupMods"
import { Label } from "@components/global.styles"

const SessionCountdown: FunctionComponent = () => {
  const sessionData = useCurrentSessionState()
  const theme = useContext(ThemeContext)
  return (
    <ListGroupItem style={{ width: "100%" }}>
      <Label>Session ends in</Label>
      <Countdown
        date={sessionData.endTime}
        renderer={({ hours, minutes, seconds, completed }) => {
          if (completed) {
            return <ListGroupHeader>Completed</ListGroupHeader>
          } else {
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
          }
        }}
      />
    </ListGroupItem>
  )
}

export default SessionCountdown
