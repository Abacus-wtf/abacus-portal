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
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import {web3Eth} from "@config/constants"
import { useActiveWeb3React } from "@hooks/index"
import { useOnWeightVote } from "@hooks/current-session"
import { UserState } from "@state/sessionData/reducer"
import _ from "lodash"
import {
  useCanUserInteract,
  useCurrentSessionData,
  useCurrentSessionUserStatus,
} from "@state/sessionData/hooks"

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
    const hash = web3Eth.eth.abi.encodeParameters(
      ["address", "uint256", "uint256"],
      [sessionData.address, Number(sessionData.tokenId), sessionData.nonce]
    )
    const itemsString = localStorage.getItem(hash)
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
  }, [account])

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
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          const cb = hash => {
            const hashedMessage = web3Eth.eth.abi.encodeParameters(
              ["address", "uint256", "uint256"],
              [
                sessionData.address,
                Number(sessionData.tokenId),
                sessionData.nonce,
              ]
            )
            localStorage.setItem(hashedMessage, "")
          }
          await onWeightVote(appraisalValue, passwordValue, cb)
        }}
      >
        <ListGroup>
          <HorizontalListGroup>
            <ListGroupItem>
              <InputWithTitle
                title={"Appraisal Value"}
                id={"appraisalValue"}
                placeholder="0"
                value={appraisalValue}
                onChange={e => setAppraisalValue(e.target.value)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title={"Seed"}
                id={"password"}
                placeholder="Input"
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
              />
            </ListGroupItem>
          </HorizontalListGroup>
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div style={{ width: "100%" }} id={"submitWeighButton"}>
            <Button
              disabled={
                !canUserInteract ||
                isPending ||
                appraisalValue === "" ||
                passwordValue === "" ||
                isNaN(Number(appraisalValue)) ||
                isNaN(Number(passwordValue)) ||
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
            placement={"right"}
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
