import { PricingSessionFilters } from "@state/sessionData/queries"
import React, { FunctionComponent, FormEvent, useState } from "react"
import styled from "styled-components"
import { Modal, ModalBody, ListGroupItem, ListGroup, Form } from "shards-react"
import { InputWithTitle } from "@components/Input"
import Button from "@components/Button"
import { SessionState } from "@state/sessionData/reducer"

const StyledModalBody = styled(ModalBody)`
  overflow-y: scroll;
  max-height: 100vh;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    overflow: unset;
  }
`

type FilterModalProps = {
  open: boolean
  toggle: () => void
  applyFilters: (filters: PricingSessionFilters) => Promise<void>
  setFilters: (filters: PricingSessionFilters) => void
}

type FilterForm<Elements> = Elements & {
  nftAddress: HTMLInputElement
  tokenId: HTMLInputElement
}

const INPUT_IDS = {
  TOKEN_ID: "tokenId",
  NFT_ADDRESS: "nftAddress",
  Vote: "vote",
  Weigh: "weigh",
  SetFinalAppraisal: "setFinalAppraisal",
  Harvest: "harvest",
  Claim: "claim",
  Complete: "complete",
}

const FilterModal: FunctionComponent<FilterModalProps> = ({
  open,
  toggle,
  applyFilters,
  setFilters,
}) => {
  const [nftAddressValue, setNftAddressValue] = useState("")
  const [tokenIdValue, setTokenIdValue] = useState("")
  const [sessionStatuses, setSessionStatuses] = useState(new Set<number>())

  const toggleSessionState = (state: SessionState) => () =>
    setSessionStatuses((statuses) => {
      if (statuses.has(state)) {
        statuses.delete(state)
      } else {
        statuses.add(state)
      }
      return new Set(statuses)
    })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { nftAddress, tokenId } = e.currentTarget as FilterForm<
      typeof e.currentTarget
    >
    const statuses = Array.from(sessionStatuses)
    const filters: PricingSessionFilters = {
      ...(tokenId.value && { tokenId: tokenId.value }),
      ...(nftAddress.value && { nftAddress: nftAddress.value }),
      ...(statuses.length && {
        sessionStatuses: statuses,
      }),
    }
    applyFilters(filters)
    setFilters(filters)
    toggle()
  }

  return (
    <Modal size="md" open={open} toggle={toggle} centered>
      <StyledModalBody>
        <h4>Select Filters</h4>
        <Form onSubmit={handleSubmit}>
          <ListGroup>
            <ListGroupItem>
              <InputWithTitle
                title="NFT Address"
                id={INPUT_IDS.NFT_ADDRESS}
                placeholder="0x16baf0de678e52367adc69fd067e5edd1d33e3bf"
                value={nftAddressValue}
                onChange={(e) => setNftAddressValue(e.target.value)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Token ID"
                id={INPUT_IDS.TOKEN_ID}
                placeholder="6407"
                value={tokenIdValue}
                onChange={(e) => setTokenIdValue(e.target.value)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Vote"
                id={INPUT_IDS.Vote}
                type="checkbox"
                checked={sessionStatuses.has(SessionState.Vote)}
                onChange={toggleSessionState(SessionState.Vote)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Weigh"
                id={INPUT_IDS.Weigh}
                type="checkbox"
                checked={sessionStatuses.has(SessionState.Weigh)}
                onChange={toggleSessionState(SessionState.Weigh)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Set Final Appraisal"
                id={INPUT_IDS.SetFinalAppraisal}
                type="checkbox"
                checked={sessionStatuses.has(SessionState.SetFinalAppraisal)}
                onChange={toggleSessionState(SessionState.SetFinalAppraisal)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Harvest"
                id={INPUT_IDS.Harvest}
                type="checkbox"
                checked={sessionStatuses.has(SessionState.Harvest)}
                onChange={toggleSessionState(SessionState.Harvest)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Claim"
                id={INPUT_IDS.Claim}
                type="checkbox"
                checked={sessionStatuses.has(SessionState.Claim)}
                onChange={toggleSessionState(SessionState.Claim)}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Complete"
                id={INPUT_IDS.Complete}
                type="checkbox"
                checked={sessionStatuses.has(SessionState.Complete)}
                onChange={toggleSessionState(SessionState.Complete)}
              />
            </ListGroupItem>
          </ListGroup>
          <Button style={{ width: "100%", marginTop: "15px" }} type="submit">
            Apply Filters
          </Button>
        </Form>
      </StyledModalBody>
    </Modal>
  )
}

export default FilterModal
