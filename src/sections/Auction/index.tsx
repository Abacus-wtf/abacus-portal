import React, { useEffect } from "react"
import { Title, SmallUniversalContainer } from "@components/global.styles"
import { useAuctionData, useSetAuctionData } from "@state/miscData/hooks"
import { ButtonsWhite } from "@components/Button"
import { shortenAddress } from "@config/utils"
import { useActiveWeb3React } from "@hooks/index"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { OutboundLink } from "gatsby-plugin-google-gtag"
import RightSection from "./RightSection"
import {
  SplitContainer,
  VerticalContainer,
  VerticalSmallGapContainer,
  FileContainer,
  SubText,
} from "../CurrentSession/CurrentSession.styles"

const Auction = () => {
  const { account } = useActiveWeb3React()
  const setAuctionData = useSetAuctionData()
  const auctionData = useAuctionData()
  const optionalInfo =
    auctionData && auctionData.optionalInfo
      ? auctionData.optionalInfo
      : undefined
  const networkSymbol = useGetCurrentNetwork()

  useEffect(() => {
    const loadUserData = async () => {
      await setAuctionData()
    }
    if (account && networkSymbol && auctionData === null) {
      loadUserData()
    }
  }, [account, networkSymbol, auctionData, setAuctionData])

  if (!account) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <ConnectWalletAlert />
      </SmallUniversalContainer>
    )
  }

  if (auctionData === null) {
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
      {optionalInfo ? (
        <SplitContainer>
          <VerticalContainer>
            <FileContainer {...optionalInfo} />
            <ButtonsWhite
              style={{ borderRadius: 8 }}
              target="_blank"
              href={`https://opensea.io/assets/${optionalInfo.highestNftAddress}/${optionalInfo.highestNftTokenId}`}
              as={OutboundLink}
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
                Highest Bounty by{" "}
                <OutboundLink
                  target="_blank"
                  href={`https://opensea.io/${optionalInfo.highestBidderAddress}`}
                >
                  {shortenAddress(optionalInfo.highestBidderAddress)}
                </OutboundLink>
              </SubText>
            </VerticalSmallGapContainer>
            <RightSection />
          </VerticalContainer>
        </SplitContainer>
      ) : (
        <VerticalContainer style={{ maxWidth: 800 }}>
          <RightSection />
        </VerticalContainer>
      )}
    </SmallUniversalContainer>
  )
}

export default Auction
