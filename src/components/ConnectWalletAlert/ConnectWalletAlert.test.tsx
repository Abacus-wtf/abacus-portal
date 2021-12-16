import { render } from "@test-utils/index"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import ConnectWalletAlert from "."

const defaultProps = {}

describe("ConnectWalletAlert", () => {
  it("Matches snapshot", () => {
    const component = render(<ConnectWalletAlert {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })
})
