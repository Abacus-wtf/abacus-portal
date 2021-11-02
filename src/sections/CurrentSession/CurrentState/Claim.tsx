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
import { ListGroupItem, Form } from "shards-react"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
  HorizontalListGroupModified,
} from "../CurrentSession.styles"
import SessionCountdown from "./SessionCountdown"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { UserState } from "@state/sessionData/reducer"
import {
  useCanUserInteract,
  useGetCurrentSessionData,
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import HashSystem from "../hashSystem"
import { useActiveWeb3React } from "@hooks/index"
import { web3 } from "@config/constants"
import {
  useOnClaim,
  useOnHarvest,
  useOnSubmitVote,
  useOnUpdateVote,
} from "@hooks/current-session"
import { keccak256 } from "@ethersproject/keccak256"
import { useIsTxOccurring } from "@state/transactions/hooks"
import _ from "lodash"

const Claim: FunctionComponent = () => {
  const [ethPayout, setEthPayout] = useState(0)
  const [abcPayout, setAbcPayout] = useState(0)
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)

  const canUserInteract = useCanUserInteract()

  const onClaim = useOnClaim()
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

      <ListGroupItem>
        <InputWithTitle
          title={"Final Appraisal Value"}
          id={"stake"}
          value={sessionData.finalAppraisalValue}
          disabled
        />
      </ListGroupItem>
      <HorizontalListGroup>
        <ListGroupItem>
          <InputWithTitle
            title={"ETH Payout"}
            id={"ethPayout"}
            placeholder="0"
            value={ethPayout}
            onChange={setEthPayout}
          />
        </ListGroupItem>
        <ListGroupItem>
          <InputWithTitle
            title={"ABC Payout"}
            id={"password"}
            placeholder="0"
            value={abcPayout}
            onChange={setAbcPayout}
          />
        </ListGroupItem>
      </HorizontalListGroup>
      <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
        <HorizontalListGroup>
          <div style={{ padding: "0 8px", width: "100%" }}>
            <Button
              disabled={!canUserInteract || isTxOccurring}
              style={{ width: "100%" }}
              type="button"
              onClick={() => {
                const cb = (hash: string) => {
                  setTxHash(hash)
                }
                onClaim(true, cb)
              }}
            >
              {isTxOccurring ? "Pending..." : "Claim ETH"}
            </Button>
          </div>
          <div style={{ padding: "0 8px", width: "100%" }}>
            <Button
              disabled={isTxOccurring}
              style={{ width: "100%" }}
              type="button"
              onClick={() => {
                const cb = (hash: string) => {
                  setTxHash(hash)
                }
                onClaim(false, cb)
              }}
            >
              {isTxOccurring ? "Pending..." : "Claim ABC"}
            </Button>
          </div>
        </HorizontalListGroup>
        <SubText style={{ display: "flex", alignItems: "center" }}>
          <User style={{ height: 14 }} /> {sessionData.numPpl} participants
        </SubText>
      </VerticalContainer>
    </>
  )
}

export default Claim
