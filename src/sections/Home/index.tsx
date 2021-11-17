import React, { useState, useEffect } from "react"
import { Title, Subheader, UniversalContainer } from "@components/global.styles"
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
import Link from "gatsby-link"
import { PromiseStatus } from "@models/PromiseStatus"
import {
  BackgroundIMG,
  HeaderBar,
  CardContainer
} from './Home.styles'
 
const Home: React.FC = () => {
  const getMultiSessionData = useGetMultiSessionData()
  const { multiSessionData, fetchStatus, errorMessage } = useMultiSessionState()
  const [searchValue, setSearchValue] = useState("")
  const isLoading = fetchStatus === PromiseStatus.Pending

  useEffect(() => {
    getMultiSessionData()
  }, [])

  return (
    <UniversalContainer>
      <BackgroundIMG />
      <HeaderBar>
        <div>
          <Title>Highlighted</Title>
          <Subheader>
            Browse {multiSessionData ? multiSessionData.length : "-"} Total
            Sessions
          </Subheader>
        </div>
        {/*<HeaderBarContainer>
          <ButtonsWhite>Filter</ButtonsWhite>
          <SearchBar
            input={searchValue}
            changeInput={input => setSearchValue(input)}
            placeholder={"Find something"}
            onEnter={() => {}}
          />
          <Button
            style={{ display: "flex", alignItems: "center" }}
            as={Link}
            to="/create-session"
          >
            Create Session
          </Button>
        </HeaderBarContainer>*/}
      </HeaderBar>
      {isLoading ? (
        <UniversalContainer style={{ alignItems: "center" }}>
          Loading... {/* TODO: find a loader */}
        </UniversalContainer>
      ) : (
        <CardContainer>
          {_.map(multiSessionData, i => (
            <Card key={`${i.address}-${i.tokenId}-${i.nonce}`} {...i} />
          ))}
        </CardContainer>
      )}
    </UniversalContainer>
  )
}

export default Home
