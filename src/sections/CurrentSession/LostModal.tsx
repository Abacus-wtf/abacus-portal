import { Label, UniversalContainer } from "@components/global.styles"
import React, { FunctionComponent } from "react"
import { Modal, ModalBody } from "shards-react"
import LostPepe from "@images/lost.gif"

type LostModalProps = {
  open: boolean
  toggle: () => void
}

const LostModal: FunctionComponent<LostModalProps> = ({ open, toggle }) => (
  <Modal size="md" open={open} toggle={toggle} centered>
    <ModalBody>
      <UniversalContainer style={{ alignItems: "center" }}>
        <Label
          htmlFor="session-state"
          style={{
            margin: "0px 0 5px 5px",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
        >
          You unfortunately lost the pricing session! Better luck next time 😞
        </Label>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          src={LostPepe}
          style={{ maxHeight: 400, maxWidth: 200, margin: 25 }}
        />
      </UniversalContainer>
    </ModalBody>
  </Modal>
)

export default LostModal
