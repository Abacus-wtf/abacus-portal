import React, { useEffect, useState } from "react"
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
import { useActiveWeb3React } from "@hooks/index"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { OutboundLink } from "gatsby-plugin-google-gtag"
import { useSetPayoutData, useClaimPayoutData } from "@state/miscData/hooks"
import RankingsModal from "@components/RankingsModal"
import {
  SplitContainer,
  VerticalContainer,
  VerticalSmallGapContainer,
  FileContainer,
  SubText,
} from "./CurrentSession.styles"
import CurrentState from "./CurrentState"

const CurrentSession = ({ location }) => {
  // const getCurrentSessionDataGRT = useGetCurrentSessionDataGRT()
  const getCurrentSessionData = useGetCurrentSessionData()
  const { account, chainId } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const fetchStatus = useCurrentSessionFetchStatus()
  const isLoading = fetchStatus === PromiseStatus.Pending
  const { address, tokenId, nonce, legacy } = queryString.parse(location.search)
  const networkSymbol = useGetCurrentNetwork()
  const claimData = useClaimPayoutData()
  const setPayoutData = useSetPayoutData()
  const [isRankingsModalOpen, setIsRankingsModalOpen] = useState(false)
  const [isFisk] = useState(
    tokenId ===
      "103662588172564032573538786729890701797701353903294947741648606022377129639937" &&
      address === "0x495f947276749ce646f68ac8c248420045cb7b5e"
  )
  useEffect(() => {
    const loadData = async () => {
      if (sessionData.address === "") {
        await getCurrentSessionData(
          String(address),
          String(tokenId),
          Number(nonce),
          legacy !== undefined && legacy
        )
      }
      if (claimData === null) {
        await setPayoutData(account)
      }
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
    claimData,
    setPayoutData,
    legacy,
    sessionData,
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
      <RankingsModal
        isOpen={isRankingsModalOpen}
        toggle={() => setIsRankingsModalOpen(!isRankingsModalOpen)}
      />
      <SplitContainer>
        <VerticalContainer>
          <FileContainer {...sessionData} />
          <div style={{ display: "flex", gridGap: 15 }}>
            <ButtonsWhite
              style={{ borderRadius: 8 }}
              target="_blank"
              href={`https://opensea.io/assets/${sessionData.address}/${sessionData.tokenId}`}
              as={OutboundLink}
            >
              OpenSea
            </ButtonsWhite>
            <ButtonsWhite
              style={{ borderRadius: 8 }}
              target="_blank"
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `https://app.abacus.wtf/current-session?address=${sessionData.address}&tokenId=${sessionData.tokenId}&nonce=${sessionData.nonce}`
              )}&text=Just%20submitted%20my%20appraisal%20for%20${
                sessionData.collectionTitle
              }%20%23${sessionData.tokenId}%20on%20Abacus!&via=abacus_wtf`}
              as={OutboundLink}
            >
              Share
            </ButtonsWhite>
            {sessionData.rankings && (
              <ButtonsWhite
                onClick={() => setIsRankingsModalOpen(true)}
                style={{ borderRadius: 8 }}
              >
                Rankings
              </ButtonsWhite>
            )}
          </div>
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
                href={`https://opensea.io/${
                  isFisk ? "fiskantes" : sessionData.ownerAddress
                }`}
              >
                {isFisk ? "Fiskantes" : sessionData.owner}
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
