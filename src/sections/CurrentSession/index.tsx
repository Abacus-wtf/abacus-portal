import React, { useEffect, useState } from "react"
import { Title, SmallUniversalContainer, Text } from "@components/global.styles"
import styled from "styled-components"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import { ImageContainer } from "@components/global.styles"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import {
  useGetCurrentSessionData,
  useGetUserStatus,
} from "@state/sessionData/hooks"
import { ButtonsWhite } from "@components/Button"
import Link from "gatsby-link"
import _ from "lodash"
import CurrentState from "./CurrentState"
import { useActiveWeb3React } from "@hooks/index"
import {
  SplitContainer,
  VerticalContainer,
  VerticalSmallGapContainer,
  SquareImageContainer,
  SubText,
  HorizontalListGroupModified,
  ListGroupItemMinWidth
} from './CurrentSession.styles'

const CurrentSession = ({ location }) => {
  const getCurrentSessionData = useGetCurrentSessionData()
  const getUserStatus = useGetUserStatus()
  const sessionData = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["sessionData"]
  >(state => state.sessionData.currentSessionData.sessionData)
  const userStatus = useSelector<
    AppState,
    AppState["sessionData"]["currentSessionData"]["userStatus"]
  >(state => state.sessionData.currentSessionData.userStatus)
  const { account } = useActiveWeb3React()

  const { address, tokenId, nonce } = queryString.parse(location.search)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      // @ts-ignore
      await getUserStatus(address!, tokenId)
      setIsLoading(false)
    }

    if (address && tokenId && !userStatus) {
      loadUserData()
    }
  }, [account, address, tokenId])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // @ts-ignore
      await getCurrentSessionData(address!, tokenId, nonce)
      setIsLoading(false)
    }

    if (!address || !tokenId || !nonce) {
      alert("This is a broken link, we are redirecting you to the home page.")
      navigate("/")
    } else {
      loadData()
    }
  }, [address, tokenId, nonce])

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
            <SubText>{sessionData.collectionTitle}</SubText>
            <Title>
              {sessionData.nftName} #{sessionData.tokenId}
            </Title>
            <SubText>
              Owned by{" "}
              <Link to={`https://opensea.io/${sessionData.ownerAddress}`}>
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
