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
import { useOnSubmitVote, useOnUpdateVote } from "@hooks/current-session"
import { keccak256 } from "@ethersproject/keccak256"
import {
  useAllTransactions,
  isTransactionRecent,
  useIsTxOccurring,
} from "@state/transactions/hooks"
import _ from "lodash"

const Vote: FunctionComponent = () => {
  const [appraisalHash, setAppraisalHash] = useState("")
  const { account, chainId, library } = useActiveWeb3React()
  const getCurrentSessionData = useGetCurrentSessionData()

  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)

  const submitVote = useOnSubmitVote()
  const updateVote = useOnUpdateVote()
  const [stakeVal, setStakeVal] = useState("")
  const [txHash, setTxHash] = useState()
  const isTxOccurring = useIsTxOccurring(txHash)
  const loadData = async () => {
    // @ts-ignore
    await getCurrentSessionData(
      sessionData.address,
      sessionData.tokenId,
      sessionData.nonce
    )
  }

  useEffect(() => {
    if (!isTxOccurring && sessionData !== null) {
      //loadData()
    }
  }, [isTxOccurring])

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
          const cb = hash => {
            setTxHash(hash)
          }
          switch (userStatus) {
            case UserState.NotVoted:
              await submitVote(
                e.target["appraise"].value,
                e.target["stake"].value,
                cb
              )
              break
            case UserState.CompletedVote:
              await updateVote(e.target["appraise"].value, cb)
              break
            default:
              break
          }
        }}
      >
        <ListGroup>
          <HashSystem
            onCreateHash={(appraisalValue, password) => {
              setAppraisalHash(
                keccak256(
                  web3.eth.abi.encodeParameters(
                    ["uint256", "address", "uint256"],
                    [appraisalValue, account!, password]
                  )
                )
              )
            }}
          />
          <ListGroupItem>
            <InputWithTitle
              title={"Appraisal Result (Hashed)"}
              id={"appraise"}
              placeholder="0"
              value={appraisalHash}
              disabled={true}
            />
          </ListGroupItem>
          {userStatus !== UserState.CompletedVote ? (
            <ListGroupItem>
              <InputWithTitle
                title={"Stake"}
                id={"stake"}
                value={stakeVal}
                onChange={e => setStakeVal(e.target.value)}
                placeholder="0.001"
              />
            </ListGroupItem>
          ) : null}
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <Button
            disabled={
              isTxOccurring ||
              appraisalHash === "" ||
              (userStatus === UserState.NotVoted &&
                (isNaN(Number(stakeVal)) || stakeVal === ""))
            }
            style={{ width: "100%" }}
            type="submit"
          >
            {isTxOccurring
              ? "Pending..."
              : userStatus === UserState.CompletedVote
              ? "Update"
              : "Submit"}
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
