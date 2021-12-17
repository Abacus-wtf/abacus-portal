import { render, userEvent, fireEvent } from "@test-utils/index"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import FilterModal from "."

const toggle = jest.fn()
const applyFilters = jest.fn()
const setFilters = jest.fn()

const defaultProps = {
  open: true,
  toggle,
  applyFilters,
  setFilters,
}

describe("FilterModal", () => {
  it("Matches snapshot", () => {
    const component = render(<FilterModal {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })

  it("calls applyFilters and setFilters on submit", () => {
    const { getByText, getByLabelText } = render(
      <FilterModal {...defaultProps} />
    )
    // fireEvent.change(getByLabelText(/NFT Address/i), {
    //   target: { value: "0x13782" },
    // })
    fireEvent.click(getByText(/Apply Filters/i))
    expect(applyFilters).toHaveBeenCalledTimes(1)
    expect(setFilters).toHaveBeenCalledTimes(1)
  })
})
