import { useGeneralizedContractError } from "@state/application/hooks"
import React, { FunctionComponent } from "react"
import { Alert } from "shards-react"
import styled from "styled-components"
import { AlertCircle } from "react-feather"
import { theme } from "@config/theme"

const StyledAlert = styled(Alert)`
  padding: 25px;
  border-radius: 20px;
  margin-top: 35px;
  margin-bottom: 0px;
  max-width: ${theme.layout.maxWidth};
  margin-right: auto;
  margin-left: auto;
  & p {
    color: white !important;
    margin: 0;
    margin-top: 15px;
  }
`

const GeneralizedContractError: FunctionComponent = () => {
  const errorMessage = useGeneralizedContractError()
  if (!errorMessage) {
    return null
  }
  return (
    <StyledAlert theme="danger">
      <AlertCircle style={{ marginTop: -9, marginRight: 15 }} />
      {errorMessage}
    </StyledAlert>
  )
}

export default GeneralizedContractError
