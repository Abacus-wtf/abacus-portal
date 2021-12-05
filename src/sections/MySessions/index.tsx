import React, { useState, useEffect, useMemo, useRef } from "react"
import styled from "styled-components"
import { Title, UniversalContainer } from "@components/global.styles"
import Button, { ButtonsWhite } from "@components/Button"
import Card from "@components/Card"
import {
  useActiveSessionsState,
  useGetActiveSessionsData,
  useGetMySessionsData,
  useMySessionsState,
} from "@state/sessionData/hooks"
import _ from "lodash"
import { PromiseStatus } from "@models/PromiseStatus"
import PaginationButton from "@components/PaginationButton"
import { useActiveWeb3React } from "@hooks/index"
import FilterModal from "@components/FilterModal"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { HeaderBar, CardContainer } from "../Home/Home.styles"

const HeaderBarStyled = styled(HeaderBar)`
  flex-direction: column;
  grid-gap: 15px;
  justify-content: space-between;
`

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  grid-gap: 24px;
`

const TabButton = styled(Button)<{ active: boolean }>`
  border-radius: 8px !important;
  ${({ active, theme }) =>
    !active &&
    `
    color: ${theme.colors.text2} !important;
    background-color: transparent !important;

    &:hover {
      background-color: transparent !important;
    }
  `}
`

const MySessions: React.FC = () => {
  const [isMySessions, setIsMySessions] = useState(true)
  const initializedMySessionsRef = useRef(false)
  const initializedActiveSessionsRef = useRef(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(null)
  const { account } = useActiveWeb3React()
  const getMySessionsData = useGetMySessionsData()
  const getActiveSessionsData = useGetActiveSessionsData()
  const mySessionsState = useMySessionsState()
  const activeSessionsState = useActiveSessionsState()
  const networkSymbol = useGetCurrentNetwork()
  const { fetchStatus, data, errorMessage, isLastPage } = isMySessions
    ? mySessionsState
    : activeSessionsState
  const isLoading = fetchStatus === PromiseStatus.Pending

  useEffect(() => {
    if (account && networkSymbol) {
      if (isMySessions) {
        if (!initializedMySessionsRef.current) {
          initializedMySessionsRef.current = true
          getMySessionsData(null)
        }
      } else if (!initializedActiveSessionsRef.current) {
        initializedActiveSessionsRef.current = true
        getActiveSessionsData(null)
      }
    }
  }, [
    isMySessions,
    getMySessionsData,
    getActiveSessionsData,
    account,
    networkSymbol,
  ])

  useEffect(() => {
    setFilters(null)
  }, [isMySessions])

  const getNextPage = isMySessions ? getMySessionsData : getActiveSessionsData

  const MySessionsContent = useMemo(() => {
    switch (fetchStatus) {
      case PromiseStatus.Rejected:
        return (
          <UniversalContainer style={{ alignItems: "center" }}>
            {errorMessage}
          </UniversalContainer>
        )
      default:
        return (
          <>
            {!isLoading && !data.length && (
              <UniversalContainer style={{ alignItems: "center" }}>
                {isMySessions
                  ? "We have not found any sessions created by you"
                  : "We have not found any sessions you participated in"}
              </UniversalContainer>
            )}
            <CardContainer>
              {_.map(data, (i) => (
                <a
                  href={`/current-session?address=${i.address}&tokenId=${i.tokenId}&nonce=${i.nonce}`}
                  key={`${i.address}-${i.tokenId}-${i.nonce}`}
                >
                  <Card {...i} />
                </a>
              ))}
            </CardContainer>
          </>
        )
    }
  }, [fetchStatus, errorMessage, isMySessions, data, isLoading])

  return (
    <UniversalContainer>
      <HeaderBarStyled>
        <Title>Sessions</Title>
        <TabContainer>
          <div>
            <TabButton
              active={isMySessions}
              onClick={() => setIsMySessions(true)}
            >
              My Sessions
            </TabButton>
            <TabButton
              active={!isMySessions}
              onClick={() => setIsMySessions(false)}
            >
              Activity
            </TabButton>
          </div>
          <ButtonsWhite onClick={() => setFilterOpen(true)}>
            Filter
          </ButtonsWhite>
          <FilterModal
            open={filterOpen}
            toggle={() => setFilterOpen(false)}
            applyFilters={getNextPage}
            setFilters={setFilters}
            prefix={isMySessions ? "" : "pricingSession"}
          />
        </TabContainer>
      </HeaderBarStyled>
      {MySessionsContent}
      <UniversalContainer style={{ alignItems: "center", marginTop: "10px" }}>
        <PaginationButton
          isLastPage={isLastPage}
          isLoading={isLoading}
          getNextPage={() => getNextPage(filters)}
        />
      </UniversalContainer>
      {isLoading && (
        <UniversalContainer style={{ alignItems: "center" }}>
          Loading... {/* TODO: find a loader */}
        </UniversalContainer>
      )}
    </UniversalContainer>
  )
}

export default MySessions
