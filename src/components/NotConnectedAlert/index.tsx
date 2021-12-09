import {
  useGetCurrentNetwork,
  useToggleWalletModal,
} from "@state/application/hooks"
import React, { FunctionComponent } from "react"
import { Alert } from "shards-react"
import styled from "styled-components"
import { AlertCircle } from "react-feather"
import { theme } from "@config/theme"
import { NetworkSymbolEnum } from "@config/constants"
import Button from "@components/Button"

const StyledAlert = styled(Alert)`
  padding: 25px;
  border-radius: 20px;
  margin-top: 35px;
  margin-bottom: 0px;
  max-width: ${theme.layout.maxWidth};
  margin-right: auto;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  & p {
    color: white !important;
    margin: 0;
    margin-top: 15px;
  }
`

const InfoContainer = styled.div`
  display: flex;
  margin-bottom: 25px;
  width: 100%;
  padding: 0 75px;
  justify-content: center;
`

const IconContainer = styled.div`
  position: absolute;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
`

const NotConnectedAlert: FunctionComponent = () => {
  const networkSymbol = useGetCurrentNetwork()
  const isNetworkSymbolNone = networkSymbol === NetworkSymbolEnum.NONE
  const toggleWalletModal = useToggleWalletModal()
  if (!isNetworkSymbolNone) {
    return null
  }
  return (
    <StyledAlert theme="info">
      <IconContainer>
        <AlertCircle size="50px" />
      </IconContainer>
      <InfoContainer>
        Your wallet is currently not connected. Please connect to interact with
        the App!
      </InfoContainer>
      <Button onClick={() => toggleWalletModal()}>Connect Wallet</Button>
    </StyledAlert>
  )
}

export default NotConnectedAlert
