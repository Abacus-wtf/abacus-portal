import React, { FunctionComponent, useContext } from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem } from "shards-react"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import _ from "lodash"

const EndSession: FunctionComponent = () => {
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)

  const theme = useContext(ThemeContext)
  return (
    <>
      <HorizontalListGroup>
        <ListGroupItemMinWidth>
          <Label>Total Staked</Label>
          <ListGroupHeader style={{ color: theme.colors.accent }}>
            {sessionData.totalStaked} ETH
          </ListGroupHeader>
          <ListGroupSubtext>
            ($
            {sessionData.totalStakedInUSD.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            )
          </ListGroupSubtext>
        </ListGroupItemMinWidth>
        <SessionCountdown />
      </HorizontalListGroup>

      <ListGroupItem>
        <InputWithTitle
          title={"Final Appraisal Value"}
          id={"stake"}
          value={sessionData.finalAppraisalValue}
          disabled
        />
      </ListGroupItem>
      <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
        <Button style={{ width: "100%" }} type="button">
          End Session
        </Button>
        <SubText style={{ display: "flex", alignItems: "center" }}>
          <User style={{ height: 14 }} /> {sessionData.numPpl} participants
        </SubText>
      </VerticalContainer>
    </>
  )
}

export default EndSession
