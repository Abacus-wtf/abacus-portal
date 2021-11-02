import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  useMemo,
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
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { web3 } from "@config/constants"
import { useActiveWeb3React } from "@hooks/index"
import { useOnWeightVote } from "@hooks/current-session"
import {
  useAllTransactions,
  isTransactionRecent,
  useIsTxOccurring,
} from "@state/transactions/hooks"
import { UserState } from "@state/sessionData/reducer"
import _ from "lodash"
import { useCanUserInteract } from "@state/sessionData/hooks"

const Weigh: FunctionComponent = () => {
  const { account } = useActiveWeb3React()
  const weightVote = useOnWeightVote()

  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const theme = useContext(ThemeContext)
  const [appraisalValue, setAppraisalValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [txHash, setTxHash] = useState("")

  const isTxOccurring = useIsTxOccurring(txHash)

  useEffect(() => {
    const hash = web3.eth.abi.encodeParameters(
      ["address", "uint256", "uint256"],
      [sessionData.address, Number(sessionData.tokenId), sessionData.nonce]
    )
    const itemsString = localStorage.getItem(hash)
    if (itemsString !== null && account) {
      const items = JSON.parse(itemsString)
      setPasswordValue(items.password)
      setAppraisalValue(items.appraisal)
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
          await weightVote(appraisalValue, passwordValue, hash => {
            setTxHash(hash)
          })
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
                isTxOccurring ||
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
              {isTxOccurring
                ? "Pending..."
                : userStatus === UserState.CompletedWeigh
                ? "Vote Weighed"
                : "Weigh"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitWeighButton"
            disabled={canUserInteract || isTxOccurring}
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
