import React from "react"
import styled from "styled-components"
import { FormInput } from "shards-react"
import { Label } from "../global.styles"

export const MainInput = styled(FormInput).attrs((props) => ({
  size: props.size || "sm",
  inputtype: props.inputtype,
  ...props,
}))`
  border: #c3c8d7;
  border-radius: 53px;
  padding: 0px;
  ${({ inputtype }) =>
    inputtype === "checkbox" &&
    `
    width: 20px;
  `};

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:active {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .form-control:focus {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  &:focus {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  &:disabled {
    background-color: transparent !important;
  }
`

type ContainerProps = {
  type: string
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${({ type }) => (type === "checkbox" ? "" : "column")};
  align-items: ${({ type }) => (type === "checkbox" ? "center" : "flex-start")};
  justify-content: ${({ type }) =>
    type === "checkbox" ? "space-between" : "center"};
`

interface InputWithTitle extends React.ComponentProps<FormInput> {
  title: string
  id: string
  type?: string
}

export const InputWithTitle = ({
  title,
  type,
  id,
  ...props
}: InputWithTitle) => (
  <Container type={type}>
    <Label style={{ marginBottom: type === "checkbox" ? 0 : 10 }} htmlFor={id}>
      {title}
    </Label>
    <MainInput
      id={id}
      style={{ borderRadius: 0 }}
      size="lg"
      inputtype={type}
      {...props}
    />
  </Container>
)

InputWithTitle.defaultProps = {
  type: "",
}
