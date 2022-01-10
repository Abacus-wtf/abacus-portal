import React, { FunctionComponent } from "react"
import { Alert } from "shards-react"
import styled from "styled-components"
import Button from "@components/Button"
import { useToggleWalletModal } from "@state/application/hooks"

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AlertCopy = styled.div`
  padding-bottom: 10px;
`

export const CONNECT_WALLET_BUTTON_ID = "CONNECT_WALLET_BUTTON_ID"

const ConnectWalletAlert: FunctionComponent = () => {
  const toggleWalletModal = useToggleWalletModal()
  return (
    <Alert theme="light" style={{ backgroundColor: "white" }}>
      <FlexContainer style={{ alignItems: "center" }}>
        <AlertCopy>
          You cannot participate until you connect your wallet
        </AlertCopy>
        <Button
          data-testid={CONNECT_WALLET_BUTTON_ID}
          onClick={() => toggleWalletModal()}
        >
          Connect Wallet
        </Button>
      </FlexContainer>
    </Alert>
  )
}

export default ConnectWalletAlert
