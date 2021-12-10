/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from "react"
import Navbar from "@components/Navbar"
import styled from "styled-components"
import { Container, Row } from "shards-react"
import Web3Modal from "@components/Web3Modal"
import Web3 from "web3"
import { useActiveWeb3React } from "@hooks/index"
import {
  useSelectNetwork,
  useGetCurrentNetwork,
} from "@state/application/hooks"
import { NetworkSymbolEnum, NetworkSymbolAndId } from "@config/constants"
import GeneralizedContractError from "@components/GeneralizedContractError"
import NotConnectedAlert from "@components/NotConnectedAlert"
import { theme } from "@config/theme"
import SEO, { SEOWithQueryProps } from "@components/SEO"
import { GlobalStyles } from "./styles"

const StyledContainer = styled(Container)`
  width: 100%;
  max-width: 1600px;
`

const RowContainer = styled(Row)`
  flex-wrap: inherit;
  padding: 15px;
  justify-content: center;

  @media ${theme.mediaMin.splitCenter} {
    padding: 65px 80px;
  }
`

const GlobalLayout: React.FC = (props: any) => {
  const { children, location } = props
  const { chainId, account } = useActiveWeb3React()
  const selectNetwork = useSelectNetwork()
  const networkSymbol = useGetCurrentNetwork()
  const isArbitrumNetwork = networkSymbol === NetworkSymbolEnum.ARBITRUM
  const isNetworkSymbolNone = networkSymbol === NetworkSymbolEnum.NONE

  useEffect(() => {
    const checkConnection = async () => {
      // Check if browser is running Metamask
      let web3: any
      // @ts-ignore
      if (window.web3) {
        // @ts-ignore
        web3 = new Web3(window.web3.currentProvider)
        // @ts-ignore
      } else if (window.ethereum) {
        // @ts-ignore
        web3 = new Web3(window.ethereum)
      }

      // Check if User is already connected by retrieving the accounts
      web3?.eth.getAccounts()
    }
    checkConnection()
  }, [])

  useEffect(() => {
    const network = NetworkSymbolAndId[chainId]
    if (!account) {
      selectNetwork(NetworkSymbolEnum.NONE)
    } else if (network) {
      selectNetwork(network)
    }
  }, [account, chainId, selectNetwork])

  const seoProps = React.useMemo<SEOWithQueryProps>(() => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Abacus Protocol",
        }
      case "/auction/":
        return {
          title: "Abacus Protocol | Auction",
        }
      case "/claim-pool/":
        return {
          title: "Abacus Protocol | Claim Pool",
        }
      case "/create-session/":
        return {
          title: "Abacus Protocol | Create New Session",
        }

      case "/current-session/":
        return {
          title: "Abacus Protocol | Current Session",
        }
      case "/my-sessions/":
        return {
          title: "Abacus Protocol | My Sessions",
        }
      default:
        return {
          title: "Abacus Protocol",
        }
    }
  }, [location.pathname])

  return (
    <>
      <SEO {...seoProps} />
      <GlobalStyles />
      <StyledContainer>
        <Navbar location={location} />
        <GeneralizedContractError />
        <NotConnectedAlert />
        <RowContainer>
          <Web3Modal />
          {!isArbitrumNetwork && !isNetworkSymbolNone ? (
            <div
              style={{
                textAlign: "center",
                maxWidth: "600px",
                lineHeight: 1.8,
              }}
            >
              We currently only support Arbitrum. Please change to the Arbitrum
              network by clicking on the ETH label in your Navigation Bar to
              access Abacus features. We will be porting to your favorite chain
              shortly!
            </div>
          ) : (
            children
          )}
        </RowContainer>
      </StyledContainer>
    </>
  )
}

export default GlobalLayout
