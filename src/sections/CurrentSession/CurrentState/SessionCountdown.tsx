import { useGetCurrentSessionData, useGetUserStatus } from "@state/sessionData/hooks"
import React, { FunctionComponent, useContext } from "react"
import Countdown from "react-countdown"
import { ThemeContext } from "styled-components"
import { ListGroupItem } from "shards-react"
import { ListGroupHeader, ListGroupSubtext } from "@components/ListGroupMods"
import { Label } from "@components/global.styles"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"

interface SessionCountdownProps {
  overrideOnComplete?: () => void
  overrideEndTime?: number
  overrideTitle?: string
}

const SessionCountdown = (props: SessionCountdownProps) => {
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const theme = useContext(ThemeContext)
  const getCurrentSessionData = useGetCurrentSessionData()
  const getUserStatus = useGetUserStatus()
  return (
    <ListGroupItem style={{ width: "100%" }}>
      <Label>{props.overrideTitle ? props.overrideTitle : 'Session ends in'}</Label>
      <Countdown
        date={props.overrideEndTime ? props.overrideEndTime : sessionData.endTime}
        onComplete={async () => {
          if (props.overrideOnComplete) {
            await props.overrideOnComplete()
          } else {
            await getCurrentSessionData(sessionData.address, sessionData.tokenId, sessionData.nonce)  
            await getUserStatus(sessionData.address, sessionData.tokenId)
          }
        }}
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
