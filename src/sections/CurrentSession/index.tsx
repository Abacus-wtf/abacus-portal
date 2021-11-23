import React, { useEffect } from "react"
import { Title, SmallUniversalContainer } from "@components/global.styles"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import {
  useCurrentSessionData,
  // useGetCurrentSessionDataGRT,
  useCurrentSessionFetchStatus,
  useGetCurrentSessionData,
} from "@state/sessionData/hooks"
import { PromiseStatus } from "@models/PromiseStatus"
import { ButtonsWhite } from "@components/Button"
import _ from "lodash"
import { useActiveWeb3React } from "@hooks/index"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { OutboundLink } from "gatsby-plugin-google-gtag"
import {
  SplitContainer,
  VerticalContainer,
  VerticalSmallGapContainer,
  SquareImageContainer,
  SubText,
} from "./CurrentSession.styles"
import CurrentState from "./CurrentState"

const CurrentSession = ({ location }) => {
  // const getCurrentSessionDataGRT = useGetCurrentSessionDataGRT()
  const getCurrentSessionData = useGetCurrentSessionData()
  const { account, chainId } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const fetchStatus = useCurrentSessionFetchStatus()
  const { address, tokenId, nonce } = queryString.parse(location.search)
  const isLoading = fetchStatus === PromiseStatus.Pending
  const networkSymbol = useGetCurrentNetwork()

  useEffect(() => {
    const loadData = async () => {
      await getCurrentSessionData(
        String(address),
        String(tokenId),
        Number(nonce)
      )
    }

    if (!address || !tokenId || !nonce) {
      alert("This is a broken link, we are redirecting you to the home page.")
      navigate("/")
    } else if (account && chainId && networkSymbol) {
      loadData()
    }
  }, [
    address,
    tokenId,
    nonce,
    account,
    networkSymbol,
    chainId,
    getCurrentSessionData,
  ])

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
            target="_blank"
            href={`https://opensea.io/assets/${sessionData.address}/${sessionData.tokenId}`}
            as={OutboundLink}
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
              <OutboundLink
                target="_blank"
                href={`https://opensea.io/assets/${sessionData.ownerAddress}`}
              >
                {sessionData.owner}
              </OutboundLink>
            </SubText>
          </VerticalSmallGapContainer>
          <CurrentState />
        </VerticalContainer>
      </SplitContainer>
    </SmallUniversalContainer>
  )
}

export default CurrentSession
