import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Title, Subheader, UniversalContainer } from "@components/global.styles"
import BackgroundSource from "@images/title_bg.png"
import Button, { ButtonsWhite } from "@components/Button"
import SearchBar from "@components/SeachBar"
import Card from "@components/Card"
import { useGetMultiSessionData } from "@state/sessionData/hooks"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import _ from "lodash"
import Link from "gatsby-link"
import { useGetCurrentNetwork } from "@state/application/hooks"

const BackgroundIMG = styled.img.attrs({
  src: BackgroundSource,
})`
  position: absolute;
  transform: rotate(30deg);
  filter: blur(4px);
  opacity: 0.4;
  height: 450px;
  z-index: -1;
  top: 0;
`

const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 45px;
`

const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  grid-gap: 12px;
  max-height: 38px;
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  row-gap: 40px;
`

const Home: React.FC = () => {
  const getMultiSessionData = useGetMultiSessionData()
  const multiSessionData = useSelector<
    AppState,
    AppState["sessionData"]["multiSessionData"]
  >(state => state.sessionData.multiSessionData)
  const [searchValue, setSearchValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const networkSymbol = useGetCurrentNetwork()

  useEffect(() => {
    if (multiSessionData !== null) {
      setIsLoading(false)
    }
  }, [multiSessionData])

  useEffect(() => {
    getMultiSessionData()
  }, [networkSymbol])

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
