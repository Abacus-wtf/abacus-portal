import Button from "@components/Button"
import { Label, UniversalContainer } from "@components/global.styles"
import styled from "styled-components"
import { useCurrentSessionData } from "@state/sessionData/hooks"
import { OutboundLink } from "gatsby-plugin-google-gtag"
import React, { FunctionComponent } from "react"
import { Modal, ModalBody } from "shards-react"

const ButtonsContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
`

type CongratsModalProps = {
  open: boolean
  toggle: () => void
}

const CongratsModal: FunctionComponent<CongratsModalProps> = ({
  open,
  toggle,
}) => {
  const { address, tokenId, nonce, collectionTitle } = useCurrentSessionData()
  return (
    <Modal size="md" open={open} toggle={toggle} centered>
      <ModalBody>
        <h4>Congrats!</h4>
        <UniversalContainer>
          <Label htmlFor="session-state" style={{ margin: "25px 0 5px 5px" }}>
            Congratulations for appraising! Share it on Twitter :)
          </Label>
          <ButtonsContainer>
            <Button
              style={{ borderRadius: 8 }}
              target="_blank"
              rel="noopener noreferrer"
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `https://app.abacus.wtf/current-session?address=${address}&tokenId=${tokenId}&nonce=${nonce}`
              )}&text=Just%20submitted%20my%20appraisal%20for%20${collectionTitle}%20%23${tokenId}%20on%20Abacus!&via=abacus_wtf`}
              as={OutboundLink}
            >
              Share
            </Button>
          </ButtonsContainer>
        </UniversalContainer>
      </ModalBody>
    </Modal>
  )
}

export default CongratsModal
