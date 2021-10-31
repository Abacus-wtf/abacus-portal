import React, {
  useEffect,
  useState,
  useContext,
  FormEvent,
  useMemo,
} from "react"
import { Title, SmallUniversalContainer, Text } from "@components/global.styles"
import styled, { ThemeContext } from "styled-components"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import { ImageContainer, Label } from "@components/global.styles"
import Button from "@components/Button"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import { useGetCurrentSessionData } from "@state/sessionData/hooks"
import { UserState, SessionState } from "@state/sessionData/reducer"
import {
  HorizontalListGroup,
  ListGroupHeader,
  ListGroupSubtext,
} from "@components/ListGroupMods"
import { ButtonsWhite } from "@components/Button"
import { ListGroupItem, ListGroup, Form } from "shards-react"
import Link from "gatsby-link"
import Countdown from "react-countdown"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import HashSystem from "./hashSystem"
import { useActiveWeb3React } from "@hooks/index"
import { web3 } from "@config/constants"
import { useOnSubmitVote, useOnUpdateVote } from "@hooks/current-session"
import { keccak256 } from "@ethersproject/keccak256"
import {
  useAllTransactions,
  isTransactionRecent,
} from "../../state/transactions/hooks"
import _ from "lodash"

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-gap: 40px;
  width: 100%;

  @media ${({ theme }) => theme.media.splitCenter} {
    grid-template-columns: 1fr;
  }
`

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: 15px;
`

const VerticalSmallGapContainer = styled(VerticalContainer)`
  grid-gap: 2px;
`

const SquareImageContainer = styled(ImageContainer)`
  max-height: 450px;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`

const SubText = styled(Text)`
  color: ${({ theme }) => theme.colors.text2};
  text-align: left;
`

const CurrentSession = ({ location }) => {
  const getCurrentSessionData = useGetCurrentSessionData()
  const { account, chainId, library } = useActiveWeb3React()

  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const sessionStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionStatus"]
  >(state => state.sessionData.currentSessionData.sessionStatus)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)

  const submitVote = useOnSubmitVote()
  const updateVote = useOnUpdateVote()
  const { address, tokenId, nonce } = queryString.parse(location.search)
  const theme = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(true)
  const [appraisalHash, setAppraisalHash] = useState("")
  const [stakeVal, setStakeVal] = useState("")
  const [txHash, setTxHash] = useState()
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent)
  }, [allTransactions])
  const pending = sortedRecentTransactions
    .filter(tx => !tx.receipt)
    .map(tx => tx.hash)
  const isTxOccurring = _.includes(pending, txHash ? txHash : "")
  const loadData = async () => {
    setIsLoading(true)
    // @ts-ignore
    await getCurrentSessionData(address!, tokenId, nonce)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!address || !tokenId || !nonce) {
      alert("This is a broken link, we are redirecting you to the home page.")
      navigate("/")
    } else {
      loadData()
    }
  }, [address, tokenId])

  useEffect(() => {
    if (!isTxOccurring && (!address || !tokenId || !nonce)) {
      loadData()
    }
  }, [isTxOccurring])

  if (isLoading || sessionData === null) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        Loading... {/* TODO: find a loader */}
      </SmallUniversalContainer>
    )
  }

  return (
    <SmallUniversalContainer style={{ alignItems: "center" }}>
      <SplitContainer>
        <VerticalContainer>
          <SquareImageContainer src={sessionData.img} />
          <ButtonsWhite
            style={{ borderRadius: 8 }}
            target={"_blank"}
            to={`https://opensea.io/${sessionData.address}/${sessionData.tokenId}`}
            as={Link}
          >
            OpenSea
          </ButtonsWhite>
        </VerticalContainer>
        <VerticalContainer>
          <VerticalSmallGapContainer>
            <SubText>{sessionData.title}</SubText>
            <Title>
              {sessionData.nftName} #{sessionData.tokenId}
            </Title>
            <SubText>
              Owned by{" "}
              <Link to={`https://opensea.io/${sessionData.owner}`}>
                {sessionData.owner}
              </Link>
            </SubText>
          </VerticalSmallGapContainer>
          <HorizontalListGroup>
            <ListGroupItem
              style={{ paddingRight: 50, minWidth: "fit-content" }}
            >
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
            <ListGroupItem style={{ width: "100%" }}>
              <Label>Session ends in</Label>
              <Countdown
                date={sessionData.endTime}
                renderer={({ hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return <ListGroupHeader>Completed</ListGroupHeader>
                  } else {
                    const colon = (
                      <ListGroupHeader
                        style={{
                          color: theme.colors.text2,
                          margin: "0px 10px",
                        }}
                      >
                        :
                      </ListGroupHeader>
                    )
                    return (
                      <div style={{ display: "flex" }}>
                        <div>
                          <ListGroupHeader>{hours}</ListGroupHeader>
                          <ListGroupSubtext>Hr</ListGroupSubtext>
                        </div>
                        {colon}
                        <div>
                          <ListGroupHeader>{minutes}</ListGroupHeader>
                          <ListGroupSubtext>Min</ListGroupSubtext>
                        </div>
                        {colon}
                        <div>
                          <ListGroupHeader>{seconds}</ListGroupHeader>
                          <ListGroupSubtext>Sec</ListGroupSubtext>
                        </div>
                      </div>
                    )
                  }
                }}
              />
            </ListGroupItem>
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
                <User style={{ height: 14 }} /> {sessionData.numPpl}{" "}
                participants
              </SubText>
            </VerticalContainer>
          </Form>
        </VerticalContainer>
      </SplitContainer>
    </SmallUniversalContainer>
  )
}

export default CurrentSession
