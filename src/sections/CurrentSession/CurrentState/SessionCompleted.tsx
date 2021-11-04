import React, { FunctionComponent, useContext } from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem } from "shards-react"
import { ListGroupItemMinWidth } from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { InputWithTitle } from "@components/Input"
import _ from "lodash"
import { useCurrentSessionData } from "@state/sessionData/hooks"

const SessionCompleted: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()

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
    </>
  )
}

export default SessionCompleted
