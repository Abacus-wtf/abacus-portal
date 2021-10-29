import React, { useEffect, useState } from "react"
import { Title, SmallUniversalContainer } from "@components/global.styles"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import {
  useCurrentSessionState,
  useGetCurrentSessionData,
} from "@state/sessionData/hooks"
import { ButtonsWhite } from "@components/Button"
import Link from "gatsby-link"
import {
  SplitContainer,
  VerticalContainer,
  SquareImageContainer,
  SubText,
  VerticalSmallGapContainer,
} from "./CurrentSession.styles"
import CurrentState from "./CurrentState"

const CurrentSession = ({ location }) => {
  const getCurrentSessionData = useGetCurrentSessionData()
  const sessionData = useCurrentSessionState()
  const { address, tokenId } = queryString.parse(location.search)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await getCurrentSessionData()
      setIsLoading(false)
    }
    if (address === undefined || tokenId === undefined) {
      alert("This is a broken link, we are redirecting you to the home page.")
      navigate("/")
    } else {
      loadData()
    }
  }, [address, tokenId])

  if (isLoading || sessionData === null) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        Loading... {/* TODO: find a loader */}
      </SmallUniversalContainer>
    )
  }

  return (
    <SmallUniversalContainer style={{ alignItems: "center" }}>
      <SplitContainer>
        <VerticalContainer>
          <SquareImageContainer src={sessionData.img} />
          <ButtonsWhite
            style={{ borderRadius: 8 }}
            target={"_blank"}
            to={`https://opensea.io/${sessionData.address}/${sessionData.tokenId}`}
            as={Link}
          >
            OpenSea
          </ButtonsWhite>
        </VerticalContainer>
        <VerticalContainer>
          <VerticalSmallGapContainer>
            <SubText>{sessionData.title}</SubText>
            <Title>
              {sessionData.nftName} #{sessionData.tokenId}
            </Title>
            <SubText>
              Owned by{" "}
              <Link to={`https://opensea.io/${sessionData.owner}`}>
                {sessionData.owner}
              </Link>
            </SubText>
          </VerticalSmallGapContainer>
          <CurrentState />
        </VerticalContainer>
      </SplitContainer>
    </SmallUniversalContainer>
  )
}

export default CurrentSession
