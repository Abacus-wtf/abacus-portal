import { render, fireEvent, getByText } from "@test-utils/index"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import Button, { ButtonsWhite, ButtonClear } from "."

const defaultProps = {
  onClick: () => {
    //
  },
}

describe("Button", () => {
  it("Matches snapshot", () => {
    const component = render(<Button {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })

  it("calls onClick when clicked", () => {
    const BUTTON_TEXT = "SUBMIT"
    const onClick = jest.fn()
    const { container } = render(
      <Button {...defaultProps} onClick={onClick}>
        {BUTTON_TEXT}
      </Button>
    )
    fireEvent(
      getByText(container, BUTTON_TEXT),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe("ButtonsWhite", () => {
  it("Matches snapshot", () => {
    const component = render(<ButtonsWhite {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })

  it("calls onClick when clicked", () => {
    const BUTTON_TEXT = "SUBMIT"
    const onClick = jest.fn()
    const { container } = render(
      <ButtonsWhite {...defaultProps} onClick={onClick}>
        {BUTTON_TEXT}
      </ButtonsWhite>
    )
    fireEvent(
      getByText(container, BUTTON_TEXT),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe("ButtonClear", () => {
  it("Matches snapshot", () => {
    const component = render(<ButtonClear {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })

  it("calls onClick when clicked", () => {
    const BUTTON_TEXT = "SUBMIT"
    const onClick = jest.fn()
    const { container } = render(
      <ButtonClear {...defaultProps} onClick={onClick}>
        {BUTTON_TEXT}
      </ButtonClear>
    )
    fireEvent(
      getByText(container, BUTTON_TEXT),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
