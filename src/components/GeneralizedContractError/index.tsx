import { useGeneralizedContractError } from "@state/application/hooks"
import React, { FunctionComponent } from "react"
import { Alert } from "shards-react"
import styled from "styled-components"
import { AlertCircle } from "react-feather"

const StyledAlert = styled(Alert)`
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
      <AlertCircle />
      {errorMessage}
    </StyledAlert>
  )
}

export default GeneralizedContractError
