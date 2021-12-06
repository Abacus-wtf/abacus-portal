import React from "react"
import { Modal, ModalBody, ListGroup, ListGroupItem } from "shards-react"
import _ from "lodash"
import {
  useCurrentSessionData,
  useCurrentSessionStatus,
} from "@state/sessionData/hooks"
import { SessionState, Vote } from "@state/sessionData/reducer"
import { getEtherscanLink, useActiveWeb3React } from "@hooks/index"
import { shortenAddress, isWithinFivePercent } from "@config/utils"
import { Title } from "@components/global.styles"
import styled from "styled-components"

const RankingsModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
  max-height: 500px;
  @media ${({ theme }) => theme.media.phone} {
    width: 100%;
  }
`

interface RowProps extends Vote {
  index?: number
}

const Row = (props: RowProps) => {
  const sessionData = useCurrentSessionData()
  const sessionStatus = useCurrentSessionStatus()
  const { chainId } = useActiveWeb3React()
  const { index, user, appraisal, amountStaked } = props
  return (
    <ListGroupItem style={{ padding: "25px 25px" }}>
      {Number(appraisal) !== 0 ? (
        <>
          <b>{`${
            index
              ? `#${index} ${
                  isWithinFivePercent(
                    Number(appraisal),
                    sessionData.finalAppraisalValue
                  )
                    ? "Won 🎉."
                    : "Lost 😔."
                } `
              : ""
          }`}</b>
          <a
            href={getEtherscanLink(chainId, user.id, "address")}
            target="_blank"
            rel="noreferrer"
          >
            {shortenAddress(user.id)}
          </a>
          {` appraised the NFT at ${appraisal} ETH with a ${amountStaked} ETH stake.`}
        </>
      ) : (
        <>
          <b>{`${index ? `#${index} Did not finish ❌. ` : ""}`}</b>
          <a
            href={getEtherscanLink(chainId, user.id, "address")}
            target="_blank"
            rel="noreferrer"
          >
            {shortenAddress(user.id)}
          </a>{" "}
          {sessionStatus === SessionState.Weigh
            ? "needs to weigh their vote."
            : "was disqualified."}
        </>
      )}
    </ListGroupItem>
  )
}

interface RankingsModalProps {
  isOpen: boolean
  toggle: () => void
}

export default (props: RankingsModalProps) => {
  const { toggle, isOpen } = props
  const sessionData = useCurrentSessionData()
  const status = useCurrentSessionStatus()

  return (
    <Modal size="lg" open={isOpen} toggle={toggle} centered>
      <RankingsModalBody>
        <Title style={{ minHeight: 50 }}>Appraisal Rankings</Title>
        <ListGroup style={{ overflow: "scroll" }}>
          {_.map(sessionData.rankings, (vote, index) => (
            <Row {...vote} index={status >= 3 ? index + 1 : undefined} />
          ))}
        </ListGroup>
      </RankingsModalBody>
    </Modal>
  )
}
