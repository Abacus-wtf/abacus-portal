import React, { useEffect, useState } from "react"
import { Title, SmallUniversalContainer, Text } from "@components/global.styles"
import styled from "styled-components"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import { ImageContainer } from "@components/global.styles"
import { useSelector } from "react-redux"
import { AppState } from "@state/index"
import {
  useSetAuctionData
} from "@state/auctionData/hooks"
import { ButtonsWhite } from "@components/Button"
import Link from "gatsby-link"
import _ from "lodash"
import { useActiveWeb3React } from "@hooks/index"
import {
  SplitContainer,
  VerticalContainer,
  VerticalSmallGapContainer,
  SquareImageContainer,
  SubText,
} from '../CurrentSession/CurrentSession.styles'
import RightSection from './RightSection'
import { shortenAddress } from "@config/utils"

const Auction = () => {
  const { account } = useActiveWeb3React()
  const [isLoading, setIsLoading] = useState(true)
  const setAuctionData = useSetAuctionData()
  const auctionData = useSelector<
    AppState,
    AppState["auctionData"]["auctionData"]
  >(state => state.auctionData.auctionData)
  const optionalInfo = auctionData && auctionData.optionalInfo ? auctionData.optionalInfo : undefined

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      await setAuctionData()
      setIsLoading(false)
    }

    loadUserData()
  }, [])

  if (isLoading || auctionData === null) {
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
      {optionalInfo ? 
        <SplitContainer>
          <VerticalContainer>
            <SquareImageContainer src={optionalInfo.img} />
            <ButtonsWhite
              style={{ borderRadius: 8 }}
              target={"_blank"}
              to={`https://opensea.io/${optionalInfo.highestNftAddress}/${optionalInfo.highestNftTokenId}`}
              as={Link}
            >
              OpenSea
            </ButtonsWhite>
          </VerticalContainer>
          <VerticalContainer>
            <VerticalSmallGapContainer>
              <SubText>{optionalInfo.highestNftCollectionTitle}</SubText>
              <Title>
                {optionalInfo.highestNftName} #{optionalInfo.highestNftTokenId}
              </Title>
              <SubText>
                Highest Bid by{" "}
                <Link to={`https://opensea.io/${optionalInfo.highestBidderAddress}`}>
                  {shortenAddress(optionalInfo.highestBidderAddress)}
                </Link>
              </SubText>
            </VerticalSmallGapContainer>
            <RightSection />
          </VerticalContainer>
        </SplitContainer> 
        : <VerticalContainer style={{maxWidth: 800}}>
            <RightSection />
          </VerticalContainer>
      }
    </SmallUniversalContainer>
  )
}

export default Auction
