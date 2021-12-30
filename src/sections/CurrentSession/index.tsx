import React, { useEffect, useState } from "react"
import { Title, SmallUniversalContainer } from "@components/global.styles"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import {
  useCurrentSessionData,
  useCurrentSessionFetchStatus,
  useCurrentSessionStatus,
  useCurrentSessionUserStatus,
  useGetCurrentSessionData,
  useGetUserStatus,
} from "@state/sessionData/hooks"
import { PromiseStatus } from "@models/PromiseStatus"
import { ButtonsWhite } from "@components/Button"
import { useActiveWeb3React } from "@hooks/index"
import ConnectWalletAlert from "@components/ConnectWalletAlert"
import { useGetCurrentNetwork } from "@state/application/hooks"
import { OutboundLink } from "gatsby-plugin-google-gtag"
import { useSetPayoutData, useClaimPayoutData } from "@state/miscData/hooks"
import RankingsModal from "@components/RankingsModal"
import { NetworkSymbolEnum } from "@config/constants"
import { SessionState } from "@state/sessionData/reducer"
import { isWithinWinRange } from "@config/utils"
import {
  SplitContainer,
  VerticalContainer,
  VerticalSmallGapContainer,
  FileContainer,
  SubText,
} from "./CurrentSession.styles"
import CurrentState from "./CurrentState"
import CongratsModal from "./CongratsModal"
import SubscribeModal from "./SubscribeModal"
import LostModal from "./LostModal"

const CurrentSession = ({ location }) => {
  const status = useCurrentSessionStatus()
  const { address, tokenId, nonce } = queryString.parse(location.search)
  const getCurrentSessionData = useGetCurrentSessionData()
  const { account, chainId } = useActiveWeb3React()
  const sessionData = useCurrentSessionData()
  const fetchStatus = useCurrentSessionFetchStatus()
  const isLoading = fetchStatus === PromiseStatus.Pending
  const networkSymbol = useGetCurrentNetwork()
  const isNetworkSymbolNone = networkSymbol === NetworkSymbolEnum.NONE
  const claimData = useClaimPayoutData()
  const setPayoutData = useSetPayoutData()
  const getUserStatus = useGetUserStatus()
  const userStatus = useCurrentSessionUserStatus()
  const [isRankingsModalOpen, setIsRankingsModalOpen] = useState(false)
  const [isSubscribeModalOpen, setSubscribeModalOpen] = useState(false)
  const [isLostModalOpen, setIsLostModalOpen] = useState(false)
  const [congratsOpen, setCongratsOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (sessionData.address === "") {
        await getCurrentSessionData(
          String(address),
          String(tokenId),
          Number(nonce)
        )
      }
      if (claimData === null) {
        await setPayoutData(account)
      }
      if (userStatus === -1) {
        await getUserStatus(String(address), String(tokenId))
      }
    }

    if (!address || !tokenId || !nonce) {
      alert("This is a broken link, we are redirecting you to the home page.")
      navigate("/")
    } else if ((account && chainId && networkSymbol) || isNetworkSymbolNone) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimData, sessionData, userStatus])

  useEffect(() => {
    const localString = `${sessionData.address}${sessionData.tokenId}${sessionData.nonce}`
    const wasShown = localStorage.getItem(localString)
    if (
      wasShown === null &&
      sessionData &&
      sessionData.finalAppraisalValue &&
      sessionData.guessedAppraisal &&
      sessionData.guessedAppraisal !== -1 &&
      sessionData.winnerAmount &&
      !isWithinWinRange(
        sessionData.guessedAppraisal,
        sessionData.finalAppraisalValue,
        sessionData.winnerAmount
      )
    ) {
      console.log("guessed", sessionData.guessedAppraisal)
      setIsLostModalOpen(true)

      localStorage.setItem(localString, "true")
    }
  }, [sessionData])

  if (!account && !isNetworkSymbolNone) {
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
            {(status === SessionState.Vote ||
              status === SessionState.Weigh) && (
              <ButtonsWhite
                onClick={() => setSubscribeModalOpen(true)}
                style={{ borderRadius: 8 }}
              >
                Subscribe
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
                href={`https://opensea.io/${sessionData.ownerAddress}`}
              >
                {sessionData.owner}
              </OutboundLink>
            </SubText>
          </VerticalSmallGapContainer>
          <CurrentState setCongratsOpen={(input) => setCongratsOpen(input)} />
          <CongratsModal
            open={congratsOpen}
            toggle={() => setCongratsOpen(!congratsOpen)}
            openSubscribeModal={() => setSubscribeModalOpen(true)}
          />
          <SubscribeModal
            open={isSubscribeModalOpen}
            toggle={() => setSubscribeModalOpen(!isSubscribeModalOpen)}
          />
          <LostModal
            open={isLostModalOpen}
            toggle={() => setIsLostModalOpen(!isLostModalOpen)}
          />
        </VerticalContainer>
      </SplitContainer>
    </SmallUniversalContainer>
  )
}

export default CurrentSession
