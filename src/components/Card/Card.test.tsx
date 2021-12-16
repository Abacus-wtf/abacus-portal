import { getByTestId, render } from "@test-utils/index"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import Card from "./index"

const defaultProps = {
  tokenId: "5007",
  image_url: "http://example.com",
  endTime: 0,
  numPpl: 2,
  nftName: "Deez Nuts",
  finalAppraisalValue: 22,
  totalStaked: 1,
  collectionTitle: "Lazy Bird",
}

describe("Card", () => {
  it("Matches snapshot", () => {
    const { container } = render(<Card {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  it("shows Total Staked when no finalAppraisalValue", () => {
    const { container } = render(
      <Card {...defaultProps} finalAppraisalValue={undefined} />
    )
    const { innerHTML } = getByTestId(container, "subtext")
    expect(innerHTML).toBe("Total Staked")
  })
})
