import React, {
  FunctionComponent,
  useContext,
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
import { ListGroupItem, Form, Tooltip } from "shards-react"
import { VerticalContainer, SubText } from "../CurrentSession.styles"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { UserState } from "@state/sessionData/reducer"
import { useCanUserInteract } from "@state/sessionData/hooks"
import { User } from "react-feather"
import _ from "lodash"
import { useOnSetFinalAppraisal } from "@hooks/current-session"
import { useIsTxOccurring } from "@state/transactions/hooks"

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

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const onSetFinalAppraisal = useOnSetFinalAppraisal()
  const [txHash, setTxHash] = useState("")
  const isTxOccurring = useIsTxOccurring(txHash)

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
          <div id={"setFinalAppraisalButton"} style={{ width: "100%" }}>
            <Button
              type="submit"
              disabled={!canUserInteract || isTxOccurring}
              style={{ width: "100%" }}
            >
              Set Final Appraisal
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#setFinalAppraisalButton"
            disabled={canUserInteract || isTxOccurring}
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
          >
            You missed a previous step, so you cannot participate in this part
            of the session
          </Tooltip>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default SetFinalAppraisal
