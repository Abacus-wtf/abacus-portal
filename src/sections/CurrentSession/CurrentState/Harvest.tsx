import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem, Form, Tooltip } from "shards-react"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { UserState } from "@state/sessionData/reducer"
import {
  useCanUserInteract,
  useCurrentSessionData,
  useCurrentSessionUserStatus,
  useGetCurrentSessionDataGRT
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useOnHarvest } from "@hooks/current-session"
import _ from "lodash"
import {CallToActionCopy} from '../CurrentSession.styles'
import { useActiveWeb3React } from "@hooks/index"
import styled from 'styled-components'

const CallToActionSmall = styled(CallToActionCopy)`
  margin-top: 35px;
  font-size: 22px;
  font-weight: bold;
`

const Harvest: FunctionComponent = () => {
  const getCurrentSessionDataGRT = useGetCurrentSessionDataGRT()
  const sessionData = useCurrentSessionData()
  const userStatus = useCurrentSessionUserStatus()
  const { account } = useActiveWeb3React()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onHarvest, isPending } = useOnHarvest()

  useEffect(() => {
    const loadData = async () => {
      await getCurrentSessionDataGRT(sessionData.address, sessionData.tokenId, sessionData.nonce)
    }
    console.log(sessionData)
    if (account && !sessionData.guessedAppraisal) {
      loadData()
    }
  }, [account])

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
            {sessionData.bounty.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })} ETH
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
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          onHarvest()
        }}
      >
        <ListGroupItem>
          <InputWithTitle
            title={"Final Appraisal Value"}
            id={"stake"}
            value={sessionData.finalAppraisalValue}
            disabled
          />
        </ListGroupItem>
        <CallToActionSmall>{sessionData.guessedAppraisal && sessionData.guessedAppraisal <= sessionData.finalAppraisalValue * 1.05 && sessionData.guessedAppraisal >= sessionData.finalAppraisalValue * 0.95 
          ? `Congrats! You appraised the NFT at ${sessionData.guessedAppraisal.toLocaleString("en-US", {minimumFractionDigits: 2,maximumFractionDigits: 2})} ETH which is within the margin of error!`
          : sessionData.guessedAppraisal < 0
          ? ''
          : sessionData.guessedAppraisal 
          ? `Sorry, you unfortunately guessed ${sessionData.guessedAppraisal.toLocaleString("en-US", {minimumFractionDigits: 2,maximumFractionDigits: 2})} ETH which is not within the margin of error. Try again next time!`
          : ''}</CallToActionSmall>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div style={{ width: "100%" }} id={"submitHarvestButton"}>
            <Button
              disabled={!canUserInteract || isPending}
              style={{ width: "100%" }}
              type="submit"
            >
              {isPending
                ? "Pending..."
                : userStatus === UserState.CompletedHarvest
                ? "Harvested"
                : "Harvest"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitHarvestButton"
            disabled={canUserInteract || isPending}
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement={"right"}
          >
            {userStatus === UserState.CompletedHarvest
              ? "You already harvested"
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
