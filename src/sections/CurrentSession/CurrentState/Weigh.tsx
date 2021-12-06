/* eslint-disable no-nested-ternary */
import React, {
  FormEvent,
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
import { ListGroupItem, ListGroup, Form, Tooltip } from "shards-react"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useActiveWeb3React } from "@hooks/index"
import { useOnWeightVote } from "@hooks/current-session"
import { UserState } from "@state/sessionData/reducer"
import {
  useCanUserInteract,
  useCurrentSessionData,
  useCurrentSessionUserStatus,
} from "@state/sessionData/hooks"
import { encodeSessionData } from "@config/utils"
import SessionCountdown from "./SessionCountdown"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"

const Weigh: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const { onWeightVote, isPending } = useOnWeightVote()

  const userStatus = useCurrentSessionUserStatus()
  const sessionData = useCurrentSessionData()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const theme = useContext(ThemeContext)
  const [appraisalValue, setAppraisalValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  useEffect(() => {
    const encodedVals = encodeSessionData({
      account,
      nftAddress: sessionData.address,
      tokenId: sessionData.tokenId,
      nonce: sessionData.nonce,
    })
    const itemsString = localStorage.getItem(encodedVals)
    if (itemsString && account) {
      try {
        const items = JSON.parse(itemsString)
        setPasswordValue(items.password)
        setAppraisalValue(items.appraisal)
      } catch {
        alert(
          "We couldn't find your appraisal/seed values. But you can still enter them in the form to weigh your vote!"
        )
      }
    }
  }, [account, sessionData.address, sessionData.nonce, sessionData.tokenId])

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
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          const cb = () => {
            const encodedVals = encodeSessionData({
              nonce: sessionData.nonce,
              nftAddress: sessionData.address,
              tokenId: sessionData.tokenId,
              account,
            })
            localStorage.setItem(encodedVals, "")
          }
          await onWeightVote(appraisalValue, passwordValue, cb)
        }}
      >
        <ListGroup>
          <HorizontalListGroup>
            <ListGroupItem>
              <InputWithTitle
                title="Appraisal Value"
                id="appraisalValue"
                placeholder="0"
                value={appraisalValue}
                onChange={(e) => setAppraisalValue(e.target.value)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Seed"
                id="password"
                placeholder="Input"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </ListGroupItem>
          </HorizontalListGroup>
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div style={{ width: "100%" }} id="submitWeighButton">
            <Button
              disabled={
                !canUserInteract ||
                isPending ||
                appraisalValue === "" ||
                passwordValue === "" ||
                Number.isNaN(Number(appraisalValue)) ||
                Number.isNaN(Number(passwordValue)) ||
                userStatus === UserState.CompletedWeigh ||
                userStatus === UserState.NotLoggedIn
              }
              style={{ width: "100%" }}
              type="submit"
            >
              {isPending
                ? "Pending..."
                : userStatus === UserState.CompletedWeigh
                ? "Vote Weighed"
                : "Weigh"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitWeighButton"
            disabled={canUserInteract || isPending}
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement="right"
          >
            {userStatus === UserState.CompletedWeigh
              ? "You already weighed your vote"
              : "You missed a previous step, so you cannot participate in this part of the session"}
          </Tooltip>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default Weigh
