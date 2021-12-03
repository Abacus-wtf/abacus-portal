import {
  ListGroup,
  ListGroupItemHeading,
  ListGroupItemText,
} from "shards-react"
import styled from "styled-components"

export const HorizontalListGroup = styled(ListGroup)`
  flex-direction: row;
  width: 100%;
  overflow: scroll;

  .list-group-item {
    border-top-width: 1px;
    border-right-width: 0px;
  }

  .list-group-item:last-child {
    border-bottom-right-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    border-bottom-left-radius: 0rem;
    border-right-width: 1px;
  }

  .list-group-item:first-child {
    border-bottom-left-radius: 0.375rem;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0rem;
  }
`

export const ListGroupHeader = styled(ListGroupItemHeading)`
  font-weight: bold;
  margin: 0px;
`

export const ListGroupSubtext = styled(ListGroupItemText)`
  margin: 0px;
  color: ${({ theme }) => theme.colors.text2} !important;
`
