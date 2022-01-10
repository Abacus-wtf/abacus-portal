import { render, fireEvent, getByTestId } from "@test-utils/index"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import ConnectWalletAlert, { CONNECT_WALLET_BUTTON_ID } from "."

const defaultProps = {}

const onClick = jest.fn()
jest.mock("@state/application/hooks", () => ({
  useToggleWalletModal: () => onClick,
}))

describe("ConnectWalletAlert", () => {
  it("Matches snapshot", () => {
    const component = render(<ConnectWalletAlert {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })

  it("calls toggleWalletModal on click", () => {
    const { container } = render(<ConnectWalletAlert {...defaultProps} />)
    fireEvent(
      getByTestId(container, CONNECT_WALLET_BUTTON_ID),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    )
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
