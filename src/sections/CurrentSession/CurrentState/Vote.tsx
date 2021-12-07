/* eslint-disable no-nested-ternary */
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
import { ListGroupItem, ListGroup, Form, Tooltip } from "shards-react"
import { UserState } from "@state/sessionData/reducer"
import {
  useCanUserInteract,
  useCurrentSessionData,
  useCurrentSessionUserStatus,
} from "@state/sessionData/hooks"
import { InputWithTitle } from "@components/Input"
import { User } from "react-feather"
import { useActiveWeb3React } from "@hooks/index"
import {
  useOnAddToBountyVote,
  useOnAddToStake,
  useOnSubmitVote,
  useOnUpdateVote,
} from "@hooks/current-session"
import { hashValues } from "@config/utils"
import { parseEther } from "ethers/lib/utils"
import { useClaimPayoutData } from "@state/miscData/hooks"
import HashSystem from "../hashSystem"
import SessionCountdown from "./SessionCountdown"
import {
  VerticalContainer,
  SubText,
  ListGroupItemMinWidth,
} from "../CurrentSession.styles"

const Vote: FunctionComponent = () => {
  const [appraisalHash, setAppraisalHash] = useState("")
  const { account } = useActiveWeb3React()

  const sessionData = useCurrentSessionData()
  const userStatus = useCurrentSessionUserStatus()
  const claimData = useClaimPayoutData()

  const canUserInteract = useCanUserInteract()
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)

  const { onSubmitVote, isPending: submitVotePending } = useOnSubmitVote()
  const { onUpdateVote, isPending: updateVotePending } = useOnUpdateVote()
  const { onAddToBounty, isPending: addToBountyPending } =
    useOnAddToBountyVote()
  const { onAddToStake, isPending: addToStakePending } = useOnAddToStake()

  const [stakeVal, setStakeVal] = useState("")
  const [bountyAddition, setBountyAddition] = useState("")
  const [stakeAddition, setStakeAddition] = useState("")

  const isPending = submitVotePending || updateVotePending

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
        <SessionCountdown />
      </HorizontalListGroup>
      <Label>
        NOTE: Your browser will store your seed number and appraisal number for
        a given pricing session. However, if you are using a private browser,
        please ensure that you save your values elsewhere.
      </Label>
      <Form
        onSubmit={async (e: FormEvent<HTMLDivElement>) => {
          e.preventDefault()
          const target = e.target as any
          const stake = Number(target.stake?.value)
          if (
            Number(target.appraisalValue?.value) >= sessionData.maxAppraisal
          ) {
            alert(
              `The Max Appraisal you can do is ${sessionData.maxAppraisal} Ether but you submitted ${target.appraisalValue.value} Ether.`
            )
            return
          }

          if (stake > Number(claimData.ethCredit)) {
            alert(
              `You tried to stake with a higher number than your credit amount. To increase your credit amount, visit the 'Claim & Deposit' page!`
            )
            return
          }

          if (stake < 0.005) {
            alert(
              `The min amount of eth you can stake is .005 Ether. You tried staking ${Number(
                target.stake.value
              )} Ether.`
            )
            return
          }

          switch (userStatus) {
            case UserState.NotVoted:
              await onSubmitVote(target.appraise.value, target.stake.value)
              break
            case UserState.CompletedVote:
              await onUpdateVote(target.appraise.value)
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
                hashValues({
                  appraisalValue: parseEther(`${appraisalValue}`),
                  account: account || "",
                  password,
                })
              )
            }}
          />
          <ListGroupItem>
            <InputWithTitle
              title="Appraisal Result (Hashed)"
              id="appraise"
              placeholder="0"
              value={appraisalHash}
              disabled
            />
          </ListGroupItem>
          {userStatus !== UserState.CompletedVote ? (
            <ListGroupItem>
              <InputWithTitle
                title={`Stake - Max: ${
                  !claimData ? "-" : claimData.ethCredit
                } ETH`}
                id="stake"
                value={stakeVal}
                onChange={(e) => setStakeVal(e.target.value)}
                placeholder="0.001"
              />
            </ListGroupItem>
          ) : null}
        </ListGroup>
        <VerticalContainer style={{ marginTop: 35, alignItems: "center" }}>
          <div style={{ width: "100%" }} id="submitVoteButton">
            <Button
              disabled={
                !canUserInteract ||
                isPending ||
                appraisalHash === "" ||
                (userStatus === UserState.NotVoted &&
                  (Number.isNaN(Number(stakeVal)) || stakeVal === ""))
              }
              style={{ width: "100%" }}
              type="submit"
            >
              {isPending
                ? "Pending..."
                : userStatus === UserState.CompletedVote
                ? "Update"
                : "Submit"}
            </Button>
          </div>
          <Tooltip
            open={isToolTipOpen}
            target="#submitVoteButton"
            disabled={canUserInteract || isPending}
            toggle={() => setIsToolTipOpen(!isToolTipOpen)}
            placement="right"
          >
            It seems you have already voted, or you are not logged in
          </Tooltip>
        </VerticalContainer>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <SubText style={{ display: "flex", alignItems: "center" }}>
            <User style={{ height: 14 }} /> {sessionData.numPpl} participants
          </SubText>
        </div>
        {userStatus === UserState.CompletedVote && (
          <ListGroup style={{ marginTop: 35 }}>
            <ListGroupItem>
              <InputWithTitle
                title={`Add to Stake - Max: ${
                  !claimData ? "-" : claimData.ethCredit
                } ETH`}
                id="stakeAddition"
                placeholder="0"
                value={stakeAddition}
                onChange={(e) => setStakeAddition(e.target.value)}
              />
            </ListGroupItem>
            <div
              style={{ width: "100%", margin: "35px 0px 10px 0px" }}
              id="addtoStakeButton"
            >
              <Button
                disabled={
                  addToStakePending ||
                  Number.isNaN(Number(stakeAddition)) ||
                  stakeAddition === ""
                }
                style={{ width: "100%" }}
                onClick={async () => {
                  await onAddToStake(stakeAddition)
                }}
              >
                {addToStakePending ? "Pending..." : "Add to Stake"}
              </Button>
            </div>
          </ListGroup>
        )}
        <ListGroup style={{ marginTop: 35 }}>
          <ListGroupItem>
            <InputWithTitle
              title="Add to Bounty"
              id="bountyAddition"
              placeholder="0"
              value={bountyAddition}
              onChange={(e) => setBountyAddition(e.target.value)}
            />
          </ListGroupItem>
          <div
            style={{ width: "100%", margin: "35px 0px 10px 0px" }}
            id="addToBountyButton"
          >
            <Button
              disabled={
                addToBountyPending ||
                Number.isNaN(Number(bountyAddition)) ||
                bountyAddition === ""
              }
              style={{ width: "100%" }}
              onClick={async () => {
                await onAddToBounty(bountyAddition)
              }}
            >
              {addToBountyPending ? "Pending..." : "Add to Bounty"}
            </Button>
          </div>
        </ListGroup>
      </Form>
    </>
  )
}

export default Vote
