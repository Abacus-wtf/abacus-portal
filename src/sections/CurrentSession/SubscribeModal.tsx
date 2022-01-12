import Button from "@components/Button"
import { Label, UniversalContainer } from "@components/global.styles"
import styled from "styled-components"
import React, { FunctionComponent, useEffect, useState } from "react"
import { Modal, ModalBody, ListGroupItem, Alert } from "shards-react"
import { InputWithTitle } from "@components/Input"
import axios from "axios"
import { BACKEND_LINK } from "@config/constants"
import {
  useCurrentSessionData,
  useCurrentSessionStatus,
} from "@state/sessionData/hooks"
import { PromiseStatus } from "@models/PromiseStatus"
import { SessionState } from "@state/sessionData/reducer"
import dogeGIF from "../../images/happy_doge.gif"

const ButtonsContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
`

type SubscribeModalProps = {
  open: boolean
  toggle: () => void
}

const SUBSCRIBE_ENDPOINT = `${BACKEND_LINK}emails/set-reminders`

const SubscribeModal: FunctionComponent<SubscribeModalProps> = ({
  open,
  toggle,
}) => {
  const { votingTime, endTime, address, tokenId, nonce } =
    useCurrentSessionData()
  const sessionState = useCurrentSessionStatus()
  const [isSubscribingStatus, setIsSubscribingStatus] = useState(
    PromiseStatus.Idle
  )
  const isLoading = isSubscribingStatus === PromiseStatus.Pending
  const hasError = isSubscribingStatus === PromiseStatus.Rejected
  const hasSubscribed = isSubscribingStatus === PromiseStatus.Resolved
  const [email, setEmail] = useState("")

  useEffect(() => {
    const emailStored = localStorage.getItem("email")
    if (email !== null) {
      setEmail(emailStored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = async () => {
    if (email === "") {
      alert("Please input an email address")
      return
    }
    setIsSubscribingStatus(PromiseStatus.Pending)
    try {
      const emailPost = await axios.post(SUBSCRIBE_ENDPOINT, {
        email,
        sessionStartTime: endTime - votingTime * 1000,
        interval: votingTime * 1000,
        sessionId: `${address}/${tokenId}/${nonce}`,
        completedVote: sessionState === SessionState.Weigh,
      })

      if (emailPost.data.success) {
        localStorage.setItem("email", email)
        setIsSubscribingStatus(PromiseStatus.Resolved)
      } else {
        setIsSubscribingStatus(PromiseStatus.Rejected)
      }
    } catch {
      setIsSubscribingStatus(PromiseStatus.Rejected)
    }
  }

  return (
    <Modal size="lg" open={open} toggle={toggle} centered>
      <ModalBody>
        <UniversalContainer style={{ alignItems: "center" }}>
          {hasSubscribed ? (
            <>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                src={dogeGIF}
                alt="Happy doge being scratched"
                style={{ maxHeight: 400, maxWidth: 200, margin: 25 }}
              />
              <Label
                htmlFor="session-state"
                style={{
                  margin: "0px 0 5px 5px",
                  fontSize: "1.5rem",
                  textAlign: "center",
                }}
              >
                You will be hearing from us soon 😉
              </Label>
            </>
          ) : (
            <>
              <Label
                htmlFor="session-state"
                style={{
                  margin: "0px 0 5px 5px",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                Don't wanna miss out on weighing your vote? Get an email sent to
                you when the weighing process begins!
              </Label>
              {hasError && (
                <Alert>Something went wrong, please try again</Alert>
              )}
              <ListGroupItem style={{ width: "100%" }}>
                <InputWithTitle
                  title="Email Address"
                  id="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={!email || !email.length}
                />
              </ListGroupItem>
              <ButtonsContainer style={{ marginTop: 35 }}>
                <Button
                  style={{ borderRadius: 8 }}
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Subscribing"
                    : "Subscribe for updates on this session"}
                </Button>
              </ButtonsContainer>
            </>
          )}
        </UniversalContainer>
      </ModalBody>
    </Modal>
  )
}

export default SubscribeModal
