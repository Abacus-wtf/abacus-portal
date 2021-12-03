import React, { FunctionComponent } from "react"
import Button from "../Button"

type PaginationButtonProps = {
  isLastPage: boolean
  isLoading: boolean
  getNextPage: () => void
}

const PaginationButton: FunctionComponent<PaginationButtonProps> = ({
  isLastPage,
  isLoading,
  getNextPage,
}) => {
  if (isLastPage || isLoading) {
    return null
  }

  const handleClick = () => {
    getNextPage()
  }

  return (
    <Button type="button" onClick={handleClick} disabled={isLoading}>
      Show More
    </Button>
  )
}

export default PaginationButton
