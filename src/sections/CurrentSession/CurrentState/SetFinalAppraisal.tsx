import React, {
  FunctionComponent,
  useContext,
  useMemo,
  FormEvent,
  useState,
} from "react"
import { ThemeContext } from "styled-components"
import { Label } from "@components/global.styles"
import Button from "@components/Button"
import styled from "styled-components"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ListGroupItem, Form } from "shards-react"
import { VerticalContainer, SubText } from "../CurrentSession.styles"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { UserState } from "@state/sessionData/reducer"
import { useGetCurrentSessionData } from "@state/sessionData/hooks"
import { User } from "react-feather"
import { useActiveWeb3React } from "@hooks/index"
import _ from "lodash"
import { useOnSetFinalAppraisal } from "@hooks/current-session"
import {
  isTransactionRecent,
  useAllTransactions,
} from "@state/transactions/hooks"

export const CallToActionCopy = styled.p`
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: center;
  font-size: ${({ theme }) => theme.copy.large};
`

const SetFinalAppraisal: FunctionComponent = () => {
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)

  const onSetFinalAppraisal = useOnSetFinalAppraisal()
  const [txHash, setTxHash] = useState("")
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent)
  }, [allTransactions])
  const pending = sortedRecentTransactions
    .filter(tx => !tx.receipt)
    .map(tx => tx.hash)
  const isTxOccurring = _.includes(pending, txHash ? txHash : "")

  const theme = useContext(ThemeContext)
  return (
    <>
      <HorizontalListGroup>
        <ListGroupItem style={{ width: "100%" }}>
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
        </ListGroupItem>
      </HorizontalListGroup>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          void onSetFinalAppraisal(hash => setTxHash(hash))
        }}
      >
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <CallToActionCopy>TIME TO SET THE FINAL APPRAISAL!</CallToActionCopy>
          <Button
            style={{ width: "100%" }}
            type="submit"
            disabled={isTxOccurring}
          >
            Set Final Appraisal
          </Button>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default SetFinalAppraisal
