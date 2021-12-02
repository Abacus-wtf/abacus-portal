import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem, Tooltip } from "shards-react"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { UserState } from "@state/sessionData/reducer"
import {
  useCanUserInteract,
  useCurrentSessionData,
  useCurrentSessionUserStatus,
  useRetrieveClaimData,
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useOnClaim } from "@hooks/current-session"
import _ from "lodash"

const Claim: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()
  const userStatus = useCurrentSessionUserStatus()
  const claimData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["claimPositions"]
  >(state => state.sessionData.currentSessionData.claimPositions)

  const retrieveClaimData = useRetrieveClaimData()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onClaim, isPending } = useOnClaim()

  useEffect(() => {
    retrieveClaimData()
  })

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
            })} ETH
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
            {sessionData.bounty} ETH
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
          title={"Final Appraisal Value"}
          id={"stake"}
          value={sessionData.finalAppraisalValue}
          disabled
        />
      </ListGroupItem>
      <HorizontalListGroup>
        <ListGroupItem>
          <InputWithTitle
            title={"ETH Payout"}
            id={"ethPayout"}
            placeholder="0"
            value={claimData ? claimData.ethClaimAmount : "-"}
            disabled
          />
        </ListGroupItem>
        <ListGroupItem>
          <InputWithTitle
            title={"ABC Payout"}
            id={"password"}
            placeholder="0"
            value={claimData ? claimData.abcClaimAmount : "-"}
            disabled
          />
        </ListGroupItem>
      </HorizontalListGroup>
      <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
        <HorizontalListGroup>
          <div
            style={{ padding: "0 8px", width: "100%" }}
            id={"claimButton"}
          >
            <Button
              disabled={!canUserInteract || isPending}
              style={{ width: "100%" }}
              type="button"
              onClick={() => {
                onClaim()
              }}
            >
              {isPending 
                ? "Pending..." 
                : userStatus === UserState.CompletedClaim
                ? "Claimed Reward"
                : "Claim Reward"}
            </Button>
            <Tooltip
              open={isToolTipOpen}
              target="#claimButton"
              disabled={canUserInteract || isPending}
              toggle={() => setIsToolTipOpen(!isToolTipOpen)}
              placement={"right"}
            >
              {userStatus === UserState.CompletedClaim
                ? "You already claimed"
                : "You missed a previous step so you cannot participate in this part of the session"}
            </Tooltip>
          </div>
        </HorizontalListGroup>
        <SubText style={{ display: "flex", alignItems: "center" }}>
          <User style={{ height: 14 }} /> {sessionData.numPpl} participants
        </SubText>
      </VerticalContainer>
    </>
  )
}

export default Claim
