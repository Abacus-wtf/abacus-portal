import { PromiseStatus } from "@models/PromiseStatus"
import React, { FormEvent, FunctionComponent, useState } from "react"
import { Form, Alert } from "shards-react"
import { InputWithTitle } from "@components/Input"
import "whatwg-fetch"
import styled from "styled-components"
import { ButtonsWhite } from "@components/Button"
import { useCurrentSessionData } from "@state/sessionData/hooks"

const StyledAlert = styled(Alert)`
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 0px;
  & p {
    color: white !important;
    margin: 0;
    margin-top: 15px;
  }
`

type SubscribeNotificationsForm<Elements> = Elements & {
  subscribe_email: HTMLInputElement
}

const SubscribeNotifications: FunctionComponent = () => {
  const fetchUrl = `${process.env.GATSBY_ABACUS_SERVER_URL}/api/v1/emails/set-reminders`
  const [isSubscribingStatus, setIsSubscribingStatus] = useState(
    PromiseStatus.Idle
  )
  const session = useCurrentSessionData()
  const sessionId = `${session.address}/${session.tokenId}/${session.nonce}`
  const isLoading = isSubscribingStatus === PromiseStatus.Pending
  const hasError = isSubscribingStatus === PromiseStatus.Rejected
  const hasSubscribed = isSubscribingStatus === PromiseStatus.Resolved

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubscribingStatus(PromiseStatus.Pending)
    const { subscribe_email } = e.target as SubscribeNotificationsForm<
      typeof e.target
    >
    try {
      const body = JSON.stringify({
        email: subscribe_email.value,
        interval: session.votingTime,
        sessionStartTime: session.endTime - session.votingTime,
        sessionId,
      })
      const res = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        redirect: "follow",
      })
      const { success } = await res.json()
      if (success) {
        setIsSubscribingStatus(PromiseStatus.Resolved)
      } else {
        setIsSubscribingStatus(PromiseStatus.Rejected)
      }
    } catch (e) {
      setIsSubscribingStatus(PromiseStatus.Rejected)
    }
  }

  if (hasSubscribed) {
    return <StyledAlert theme="info">Thanks for subscribing!</StyledAlert>
  }

  return (
    <>
      <StyledAlert theme="info">
        <Form onSubmit={handleSubmit} disabled={isLoading}>
          {hasError && (
            <p style={{ marginBottom: "15px" }}>
              Something went wrong, please try again
            </p>
          )}
          <InputWithTitle
            title="Subscribe to Notifications"
            id="subscribe_email"
            name="subscribe_email"
            placeholder="email@example.com"
            infoText="Subscribe to Email Notifications for this Session"
            disabled={isLoading}
          />
          <ButtonsWhite style={{ marginTop: "15px" }} type="submit">
            {isLoading ? "Submitting" : "Submit"}
          </ButtonsWhite>
        </Form>
      </StyledAlert>
    </>
  )
}

export default SubscribeNotifications
