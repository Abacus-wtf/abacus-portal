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
import { ListGroupItem, Tooltip, ListGroup } from "shards-react"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import {
  useCanUserInteract,
  useCurrentSessionData,
  useRetrieveClaimData,
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useOnClaim } from "@hooks/current-session"
import SessionCountdown from "./SessionCountdown"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"

const Claim: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()
  const claimData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["claimPositions"]
  >((state) => state.sessionData.currentSessionData.claimPositions)

  const retrieveClaimData = useRetrieveClaimData()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onClaim, isPending } = useOnClaim()

  useEffect(() => {
    retrieveClaimData()
  }, [retrieveClaimData])

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

      <ListGroup>
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
        <ListGroupItem>
          <InputWithTitle
            title="Total Reward Left"
            id="totalRewardLeft"
            placeholder="0"
            value={
              claimData
                ? `${claimData.totalProfit.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })} ETH`
                : "-"
            }
            disabled
          />
        </ListGroupItem>
      </ListGroup>
      {/* <HorizontalListGroup>
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
      </HorizontalListGroup> */}
      <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
        <HorizontalListGroup>
          <div style={{ padding: "0 8px", width: "100%" }} id="claimButton">
            <Button
              disabled={!canUserInteract || isPending}
              style={{ width: "100%" }}
              type="button"
              onClick={() => {
                onClaim()
              }}
            >
              {isPending ? "Pending..." : "Claim Reward"}
            </Button>
            <Tooltip
              open={isToolTipOpen}
              target="#claimButton"
              disabled={canUserInteract || isPending}
              toggle={() => setIsToolTipOpen(!isToolTipOpen)}
              placement="right"
            >
              You missed a previous step so you cannot participate in this part
              of the session
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
