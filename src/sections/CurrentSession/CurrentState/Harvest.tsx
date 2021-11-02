import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useState,
  useMemo,
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
import { ListGroupItem, ListGroup, Form } from "shards-react"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { UserState } from "@state/sessionData/reducer"
import { useGetCurrentSessionData } from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import HashSystem from "../hashSystem"
import { useActiveWeb3React } from "@hooks/index"
import { web3 } from "@config/constants"
import {
  useOnHarvest,
  useOnSubmitVote,
  useOnUpdateVote,
} from "@hooks/current-session"
import { keccak256 } from "@ethersproject/keccak256"
import {
  useAllTransactions,
  isTransactionRecent,
  useIsTxOccurring,
} from "@state/transactions/hooks"
import _ from "lodash"

const Harvest: FunctionComponent = () => {
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)

  const onHarvest = useOnHarvest()
  const [txHash, setTxHash] = useState("")
  const isTxOccurring = useIsTxOccurring(txHash)

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
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          onHarvest(hash => setTxHash(hash))
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
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <Button
            disabled={isTxOccurring}
            style={{ width: "100%" }}
            type="submit"
          >
            {isTxOccurring ? "Pending..." : "Harvest"}
          </Button>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default Harvest
