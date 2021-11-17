import React, { useState, useEffect, useMemo } from "react"
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
  const getMySessionsData = useGetMySessionsData()
  const getActiveSessionsData = useGetActiveSessionsData()
  const mySessionsState = useMySessionsState()
  const activeSessionsState = useActiveSessionsState()
  const { fetchStatus, data, errorMessage } = isMySessions
    ? mySessionsState
    : activeSessionsState

  useEffect(() => {
    if (isMySessions) {
      getMySessionsData()
    } else {
      getActiveSessionsData()
    }
  }, [isMySessions, getMySessionsData, getActiveSessionsData])

  const MySessionsContent = useMemo(() => {
    switch (fetchStatus) {
      case PromiseStatus.Pending:
        return (
          <UniversalContainer style={{ alignItems: "center" }}>
            Loading... {/* TODO: find a loader */}
          </UniversalContainer>
        )
      case PromiseStatus.Rejected:
        return (
          <UniversalContainer style={{ alignItems: "center" }}>
            {errorMessage}
          </UniversalContainer>
        )
      case PromiseStatus.Resolved:
        return (
          <>
            {!data.length && (
              <UniversalContainer style={{ alignItems: "center" }}>
                {isMySessions
                  ? "We have not found any sessions created by you"
                  : "We have not found any sessions you are participating in"}
              </UniversalContainer>
            )}
            <CardContainer>
              {_.map(data, i => (
                <Card key={`${i.address}-${i.tokenId}-${i.nonce}`} {...i} />
              ))}
            </CardContainer>
          </>
        )
      default:
        return null
    }
  }, [fetchStatus, errorMessage, isMySessions, data])

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
    </UniversalContainer>
  )
}

export default MySessions
