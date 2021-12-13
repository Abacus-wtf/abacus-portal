import Button from "@components/Button"
import { Label, UniversalContainer } from "@components/global.styles"
import styled from "styled-components"
import React, { FunctionComponent, useEffect, useState } from "react"
import { Modal, ModalBody, ListGroupItem } from "shards-react"
import HappyDoge from "@images/happy_doge.gif"
import { InputWithTitle } from "@components/Input"
import axios from "axios"
import { BACKEND_LINK } from "@config/constants"
import { useCurrentSessionData } from "@state/sessionData/hooks"

const ButtonsContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
`

type SubscribeModalProps = {
  open: boolean
  toggle: () => void
}

const SubscribeModal: FunctionComponent<SubscribeModalProps> = ({
  open,
  toggle,
}) => {
  const { votingTime, endTime } = useCurrentSessionData()
  const [email, setEmail] = useState("")
  const [complete, setComplete] = useState(false)

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
    const emailPost = await axios.post(`${BACKEND_LINK}emails/set-reminders`, {
      email,
      sessionStartTime: endTime - votingTime * 1000,
      interval: votingTime * 1000,
    })

    localStorage.setItem("email", email)

    if (emailPost.data.success) {
      setComplete(true)
    }
  }

  return (
    <Modal size="lg" open={open} toggle={toggle} centered>
      <ModalBody>
        <UniversalContainer style={{ alignItems: "center" }}>
          {complete ? (
            <>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                src={HappyDoge}
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
              <ListGroupItem style={{ width: "100%" }}>
                <InputWithTitle
                  title="Email Address"
                  id="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </ListGroupItem>
              <ButtonsContainer style={{ marginTop: 35 }}>
                <Button style={{ borderRadius: 8 }} onClick={handleClick}>
                  Subscribe for updates on this session
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
