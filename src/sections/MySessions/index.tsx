import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Title, Subheader, UniversalContainer } from "@components/global.styles"
import BackgroundSource from "@images/title_bg.png"
import Button, { ButtonsWhite } from "@components/Button"
import SearchBar from "@components/SeachBar"
import Card from "@components/Card"
import {
  useGetMultiSessionData,
  useMultiSessionState,
} from "@state/sessionData/hooks"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import _ from "lodash"
import { PromiseStatus } from "@models/PromiseStatus"
import {
  HeaderBar, 
  CardContainer
} from '../Home/Home.styles'

const HeaderBarStyled = styled(HeaderBar)`
  flex-direction: column;
  grid-gap: 15px;
`

const TabContainer = styled.div`
  display: flex;
  grid-gap: 24px;
`

const TabButton = styled(Button)<{active: boolean}>`
  border-radius: 8px !important;
  ${({active, theme}) => !active && `
    color: ${theme.colors.text2} !important;
    background-color: transparent !important;

    &:hover {
      background-color: transparent !important;
    }
  `}
`

const MySessions: React.FC = () => {
  const getMultiSessionData = useGetMultiSessionData()
  const { multiSessionData, fetchStatus } = useMultiSessionState()
  const isLoading = fetchStatus === PromiseStatus.Pending
  const [isMySessions, setIsMySessions] = useState(true)

  useEffect(() => {
    getMultiSessionData()
  }, [])

  return (
    <UniversalContainer>
      <HeaderBarStyled>
        <Title>Sessions</Title>
        <TabContainer>
          <TabButton active={isMySessions} onClick={() => setIsMySessions(true)}>My Sessions</TabButton>
          <TabButton active={!isMySessions} onClick={() => setIsMySessions(false)}>Activity</TabButton>
        </TabContainer>
      </HeaderBarStyled>
      {isLoading ? (
        <UniversalContainer style={{ alignItems: "center" }}>
          Loading... {/* TODO: find a loader */}
        </UniversalContainer>
      ) : (
        <CardContainer>
          {_.map(isMySessions ? multiSessionData : multiSessionData, i => (
            <Card key={`${i.address}-${i.tokenId}-${i.nonce}`} {...i} />
          ))}
        </CardContainer>
      )}
    </UniversalContainer>
  )
}

export default MySessions
