import React, { useState, useEffect, useRef } from "react"
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
import { useActiveWeb3React } from "@hooks/index"

const BackgroundIMG = styled.img.attrs({
  src: BackgroundSource,
})`
  display: none;
  position: absolute;
  transform: rotate(30deg);
  filter: blur(4px);
  opacity: 0.4;
  height: 450px;
  z-index: -1;
  top: 0;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    display: unset;
  }
`

const HeaderBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 45px;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    flex-direction: row;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media ${({theme}) => theme.media.tablet} {
    align-items: center;
  }

`

const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  grid-gap: 12px;
  max-height: 38px;
  margin-top: 15px;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    margin-top: 0;
    justify-content: flex-start;
    flex-direction: row;
  }
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  @media ${({ theme }) => theme.mediaMin.phone} {
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    row-gap: 40px;
  }

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    row-gap: 40px;
  }
`

const Home: React.FC = () => {
  const getMultiSessionData = useGetMultiSessionData()
  const multiSessionData = useSelector<
    AppState,
    AppState["sessionData"]["multiSessionData"]
  >((state) => state.sessionData.multiSessionData)
  const [searchValue, setSearchValue] = useState("")
  const networkSymbol = useGetCurrentNetwork()

  useEffect(() => {
    if (networkSymbol) {
      getMultiSessionData()
    }
  }, [networkSymbol])

  return (
    <UniversalContainer>
      <BackgroundIMG />
      <HeaderBar>
        <Header>
          <Title>Highlighted</Title>
          <Subheader>
            Browse {multiSessionData ? multiSessionData.length : "-"} Total
            Sessions
          </Subheader>
        </Header>
        <HeaderBarContainer>
          {/* <ButtonsWhite>Filter</ButtonsWhite>
          <SearchBar
            input={searchValue}
            changeInput={input => setSearchValue(input)}
            placeholder={"Find something"}
            onEnter={() => {}}
          /> */}
          <Button
            style={{ display: "flex", alignItems: "center" }}
            as={Link}
            to="/create-session"
          >
            Create Session
          </Button>
        </HeaderBarContainer>
      </HeaderBar>
      {multiSessionData === null ? (
        <UniversalContainer style={{ alignItems: "center" }}>
          Loading... {/* TODO: find a loader */}
        </UniversalContainer>
      ) : (
        <CardContainer>
          {_.map(multiSessionData, (i) => (
            <Card key={`${i.address}-${i.tokenId}-${i.nonce}`} {...i} />
          ))}
        </CardContainer>
      )}
    </UniversalContainer>
  )
}

export default Home
