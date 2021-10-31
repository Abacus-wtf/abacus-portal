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
import { ListGroupItem, ListGroup, Form } from "shards-react"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import { VerticalContainer, SubText } from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"

const Weigh: FunctionComponent = () => {
  const sessionData = useCurrentSessionState()
  const theme = useContext(ThemeContext)
  const [appraisalValue, setAppraisalValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  return (
    <>
      <HorizontalListGroup>
        <ListGroupItem style={{ paddingRight: 50 }}>
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
        <SessionCountdown />
      </HorizontalListGroup>
      <Form
        onSubmit={(e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          console.log(e.target["appraise"].value)
          console.log(e.target["stake"].value)
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
          <Button style={{ width: "100%" }} type="submit">
            Weigh Vote
          </Button>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default Weigh
