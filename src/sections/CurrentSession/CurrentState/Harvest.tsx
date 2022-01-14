import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useState,
} from "react"
import styled, { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem, Form, Tooltip } from "shards-react"
import {
  useCanUserInteract,
  useCurrentSessionData,
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useOnHarvest } from "@hooks/current-session"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { NetworkSymbolEnum } from "@config/constants"
import {
  CallToActionCopy,
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { isWithinWinRange } from "@config/utils"

const CallToActionSmall = styled(CallToActionCopy)`
  margin-top: 35px;
  font-size: 22px;
  font-weight: bold;
`

const Harvest: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()
  const networkSymbol = useGetCurrentNetwork()
  const isNetworkSymbolNone = networkSymbol === NetworkSymbolEnum.NONE

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onHarvest, isPending } = useOnHarvest()

  const theme = useContext(ThemeContext)
  return (
    <>
      <HorizontalListGroup>
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
        <SessionCountdown />
      </HorizontalListGroup>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          onHarvest()
        }}
        disabled={isNetworkSymbolNone}
      >
        <ListGroupItem>
          <InputWithTitle
            title="Final Appraisal Value"
            id="stake"
            value={`${sessionData.finalAppraisalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })} ETH`}
            disabled
            infoText="The final appraisal value has been determined for this pricing session."
          />
        </ListGroupItem>
        <CallToActionSmall>
          {sessionData.guessedAppraisal &&
          isWithinWinRange(
            sessionData.guessedAppraisal,
            sessionData.finalAppraisalValue,
            sessionData.winnerAmount
          )
            ? `Congrats! You appraised the NFT at ${sessionData.guessedAppraisal.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )} ETH which is within the margin of error!`
            : sessionData.guessedAppraisal < 0
            ? ""
            : sessionData.guessedAppraisal
            ? `Sorry, you unfortunately guessed ${sessionData.guessedAppraisal.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )} ETH which is not within the margin of error. Try again next time!`
            : ""}
        </CallToActionSmall>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div style={{ width: "100%" }} id="submitHarvestButton">
            <Button
              disabled={!canUserInteract || isPending || isNetworkSymbolNone}
              style={{ width: "100%" }}
              type="submit"
            >
              {isPending ? "Pending..." : "Harvest"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitHarvestButton"
            disabled={canUserInteract || isPending}
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement="right"
          >
            {isNetworkSymbolNone
              ? "Your wallet is not connected!"
              : "You missed a previous step so you cannot participate in this part of the session"}
          </Tooltip>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default Harvest
