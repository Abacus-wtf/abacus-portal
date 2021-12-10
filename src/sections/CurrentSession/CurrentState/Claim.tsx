import React, { FunctionComponent, useContext, useState } from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import { useGetCurrentNetwork } from "@state/application/hooks"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem, Tooltip, ListGroup } from "shards-react"
import {
  useCanUserInteract,
  useCurrentSessionData,
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { NetworkSymbolEnum } from "@config/constants"
import { useOnClaim } from "@hooks/current-session"
import SessionCountdown from "./SessionCountdown"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"

const Claim: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()
  const networkSymbol = useGetCurrentNetwork()
  const isNetworkSymbolNone = networkSymbol === NetworkSymbolEnum.NONE

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onClaim, isPending } = useOnClaim()

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
              disabled={!canUserInteract || isPending || isNetworkSymbolNone}
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
              {isNetworkSymbolNone
                ? "Your wallet is not connected!"
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
