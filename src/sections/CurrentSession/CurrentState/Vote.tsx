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
import HashSystem from "../hashSystem"
import { useCurrentSessionState } from "@state/sessionData/hooks"
import { VerticalContainer, SubText } from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"

const Vote: FunctionComponent = () => {
  const [appraisalHash, setAppraisalHash] = useState("")
  const sessionData = useCurrentSessionState()
  const theme = useContext(ThemeContext)
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
          <HashSystem
            onCreateHash={(appraisalValue, password) => {
              setAppraisalHash("0x")
            }}
          />
          <ListGroupItem>
            <InputWithTitle
              title={"Appraisal Result (Hashed)"}
              id={"appraise"}
              placeholder="0"
              disabled={true}
              value={appraisalHash}
            />
          </ListGroupItem>
          <ListGroupItem>
            <InputWithTitle title={"Stake"} id={"stake"} placeholder="0" />
          </ListGroupItem>
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <Button style={{ width: "100%" }} type="submit">
            Submit
          </Button>
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </VerticalContainer>
      </Form>
    </>
  )
}

export default Vote
