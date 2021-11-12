import React, { useEffect, useState } from "react"
import { Title, SmallUniversalContainer } from "@components/global.styles"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import {
  useCurrentSessionData,
  useGetCurrentSessionDataGRT,
  useCurrentSessionFetchStatus
} from "@state/sessionData/hooks"
import { PromiseStatus } from "@models/PromiseStatus"
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
} from "./CurrentSession.styles"
import ConnectWalletAlert from "@components/ConnectWalletAlert"

const CurrentSession = ({ location }) => {
  const getCurrentSessionDataGRT = useGetCurrentSessionDataGRT()
  const { account } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const fetchStatus = useCurrentSessionFetchStatus()
  const { address, tokenId, nonce } = queryString.parse(location.search)
  const isLoading = fetchStatus === PromiseStatus.Pending

  useEffect(() => {
    const loadData = async () => {
      // @ts-ignore
      await getCurrentSessionDataGRT(address!, tokenId, nonce)
    }

    if (!address || !tokenId || !nonce) {
      alert("This is a broken link, we are redirecting you to the home page.")
      navigate("/")
    } else {
      if (account) {
        loadData()
      }
    }
  }, [address, tokenId, nonce, account])

  if (!account) {
    return (
      <SmallUniversalContainer
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <ConnectWalletAlert />
      </SmallUniversalContainer>
    )
  }

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
            to={`https://opensea.io/assets/${sessionData.address}/${sessionData.tokenId}`}
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
              <Link to={`https://opensea.io/assets/${sessionData.ownerAddress}`}>
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
