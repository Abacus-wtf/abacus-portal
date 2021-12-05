/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from "react"
import Helmet from "react-helmet"
import Navbar from "@components/Navbar"
import styled from "styled-components"
import { Container, Row } from "shards-react"
import Web3Modal from "@components/Web3Modal"
import Web3 from "web3"
import { useActiveWeb3React } from "@hooks/index"
import { useSelectNetwork } from "@state/application/hooks"
import { NetworkSymbolEnum, NetworkSymbolAndId } from "@config/constants"
import { GlobalStyles } from "./styles"

const StyledContainer = styled(Container)`
  width: 100%;
  max-width: 1600px;
`

const RowContainer = styled(Row)`
  flex-wrap: inherit;
  padding: 15px;
  justify-content: center;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    padding: 65px 80px;
  }
`

const GlobalLayout: React.FC = (props: any) => {
  const { children, location } = props
  const { chainId } = useActiveWeb3React()
  const selectNetwork = useSelectNetwork()

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
    if (network) {
      selectNetwork(network)
    }
  }, [chainId, selectNetwork])

  return (
    <>
      <GlobalStyles />
      <Helmet title="Abacus Protocol" />
      <Helmet>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@abacus_wtf" />
        <meta name="twitter:creator" content="@abacus_wtf" />
        <meta name="twitter:title" content="Abacus Protocol" />
        <meta
          name="twitter:description"
          content="A permissionless NFT valuation tool"
        />
      </Helmet>
      <StyledContainer>
        <Navbar location={location} />
        <RowContainer>
          <Web3Modal />
          {NetworkSymbolAndId[chainId] !== NetworkSymbolEnum.ARBITRUM ? (
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
