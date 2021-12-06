import React, { FunctionComponent, useContext } from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem } from "shards-react"
import { InputWithTitle } from "@components/Input"
import { useCurrentSessionData } from "@state/sessionData/hooks"
import SessionCountdown from "./SessionCountdown"
import { ListGroupItemMinWidth } from "../CurrentSession.styles"

const SessionCompleted: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()

  const theme = useContext(ThemeContext)
  return (
    <>
      <HorizontalListGroup>
        <ListGroupItemMinWidth>
          <Label>Total Staked</Label>
          <ListGroupHeader style={{ color: theme.colors.accent }}>
            {sessionData.totalStaked.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{" "}
            ETH
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
        <ListGroupItemMinWidth>
          <Label>Bounty</Label>
          <ListGroupHeader style={{ color: theme.colors.accent }}>
            {sessionData.bounty.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{" "}
            ETH
          </ListGroupHeader>
          <ListGroupSubtext>
            ($
            {sessionData.bountyInUSD.toLocaleString("en-US", {
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
          title="Final Appraisal Value"
          id="stake"
          value={`${sessionData.finalAppraisalValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })} ETH`}
          disabled
        />
      </ListGroupItem>
    </>
  )
}

export default SessionCompleted
