import { render } from "@testing-library/react"
import React from "react"
import "@testing-library/jest-dom/extend-expect"
import PaginationButton from "."

const defaultProps = {
  isLastPage: false,
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getNextPage: () => {},
}

describe("Pagination Button", () => {
  it("Matches snapshot", () => {
    const component = render(<PaginationButton {...defaultProps} />)
    expect(component.container).toMatchSnapshot()
  })

  it("Should be null when loading", () => {
    const { container } = render(
      <PaginationButton {...defaultProps} isLoading />
    )
    expect(container.firstChild).toBeNull()
  })

  it("Should be null when last page", () => {
    const { container } = render(
      <PaginationButton {...defaultProps} isLastPage />
    )
    expect(container.firstChild).toBeNull()
  })
})
