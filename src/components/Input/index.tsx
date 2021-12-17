import React, { useState } from "react"
import styled from "styled-components"
import { FormInput, Tooltip } from "shards-react"
import { ButtonsWhite } from "@components/Button"
import { Info } from "react-feather"
import { Label } from "../global.styles"

export const MainInput = styled(FormInput).attrs((props) => ({
  size: props.size || "sm",
  ...props,
}))`
  border: transparent;
  border-radius: 0px;
  padding: 0px;
  ${({ inputtype }) =>
    inputtype === "checkbox" &&
    `
    width: 20px;
  `}

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
  infoText?: string
}

export const InputWithTitle = ({
  title,
  type = "text",
  id,
  infoText,
  ...props
}: InputWithTitle) => {
  const [isToolTipOpen, setIsToolTipOpen] = useState(false)
  return (
    <Container type={type}>
      <Label
        style={{ marginBottom: type === "checkbox" ? 0 : 10 }}
        htmlFor={id}
      >
        {title}
        {infoText && (
          <>
            <Info style={{ height: 15, marginTop: -2, marginLeft: 1 }} />
            <Tooltip
              open={isToolTipOpen}
              target={`#${id}`}
              toggle={() => setIsToolTipOpen(!isToolTipOpen)}
              placement="right"
              trigger="hover"
            >
              {infoText}
            </Tooltip>
          </>
        )}
      </Label>
      <MainInput id={id} size="lg" inputtype={type} {...props} />
    </Container>
  )
}

InputWithTitle.defaultProps = {
  type: "",
}

interface InputWithTitleAndButtonProps extends InputWithTitle {
  buttonText: string
  onClick: () => void
}

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const InputWithTitleAndButton = ({
  title,
  type,
  id,
  buttonText,
  onClick,
  ...props
}: InputWithTitleAndButtonProps) => (
  <Container type={type}>
    <Label style={{ marginBottom: type === "checkbox" ? 0 : 10 }} htmlFor={id}>
      {title}
    </Label>
    <InputContainer>
      <MainInput
        id={id}
        style={{ borderRadius: 0 }}
        size="lg"
        type={type}
        {...props}
      />
      <ButtonsWhite onClick={onClick}>{buttonText}</ButtonsWhite>
    </InputContainer>
  </Container>
)
