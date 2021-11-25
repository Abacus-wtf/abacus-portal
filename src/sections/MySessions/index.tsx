import React, { useState, useEffect, useMemo, useRef } from "react"
import styled from "styled-components"
import { Title, UniversalContainer } from "@components/global.styles"
import Button from "@components/Button"
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
import { Link } from "gatsby"
import { HeaderBar, CardContainer } from "../Home/Home.styles"

const HeaderBarStyled = styled(HeaderBar)`
  flex-direction: column;
  grid-gap: 15px;
`

const TabContainer = styled.div`
  display: flex;
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
  const { account } = useActiveWeb3React()
  const getMySessionsData = useGetMySessionsData()
  const getActiveSessionsData = useGetActiveSessionsData()
  const mySessionsState = useMySessionsState()
  const activeSessionsState = useActiveSessionsState()
  const { fetchStatus, data, errorMessage, isLastPage } = isMySessions
    ? mySessionsState
    : activeSessionsState
  const isLoading = fetchStatus === PromiseStatus.Pending

  useEffect(() => {
    if (account) {
      if (isMySessions) {
        if (!initializedMySessionsRef.current) {
          initializedMySessionsRef.current = true
          getMySessionsData()
        }
      } else if (!initializedActiveSessionsRef.current) {
        initializedActiveSessionsRef.current = true
        getActiveSessionsData()
      }
    }
  }, [isMySessions, getMySessionsData, getActiveSessionsData, account])

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
                <Link
                  to={`/current-session?address=${i.address}&tokenId=${i.tokenId}&nonce=${i.nonce}`}
                  key={`${i.address}-${i.tokenId}-${i.nonce}`}
                >
                  <Card {...i} />
                </Link>
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
        </TabContainer>
      </HeaderBarStyled>
      {MySessionsContent}
      <UniversalContainer style={{ alignItems: "center", marginTop: "10px" }}>
        <PaginationButton
          isLastPage={isLastPage}
          isLoading={isLoading}
          getNextPage={getNextPage}
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
