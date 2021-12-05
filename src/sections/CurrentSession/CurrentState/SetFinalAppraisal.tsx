import React, {
  FunctionComponent,
  useContext,
  FormEvent,
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
import { Form, Tooltip } from "shards-react"
import {
  useCanUserInteract,
  useCurrentSessionData,
} from "@state/sessionData/hooks"
import { User } from "react-feather"
import { useOnSetFinalAppraisal } from "@hooks/current-session"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
  CallToActionCopy,
} from "../CurrentSession.styles"

const SetFinalAppraisal: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onSetFinalAppraisal, isPending } = useOnSetFinalAppraisal()

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
      </HorizontalListGroup>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          onSetFinalAppraisal()
        }}
      >
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <CallToActionCopy>TIME TO SET THE FINAL APPRAISAL!</CallToActionCopy>
          <div id="setFinalAppraisalButton" style={{ width: "100%" }}>
            <Button
              type="submit"
              disabled={!canUserInteract || isPending}
              style={{ width: "100%" }}
            >
              {isPending ? "Pending..." : "Set Final Appraisal"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#setFinalAppraisalButton"
            disabled={canUserInteract || isPending}
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
