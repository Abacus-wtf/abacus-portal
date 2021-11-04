import React, {
  FormEvent,
  FunctionComponent,
  useContext,
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
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useOnHarvest } from "@hooks/current-session"
import _ from "lodash"

const Harvest: FunctionComponent = () => {
  const sessionData = useCurrentSessionData()
  const userStatus = useCurrentSessionUserStatus()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onHarvest, isPending } = useOnHarvest()

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
