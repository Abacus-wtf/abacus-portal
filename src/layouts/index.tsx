import React, { useEffect } from "react"
import Helmet from "react-helmet"
import { GlobalStyles } from "./styles"
import Navbar from "@components/Navbar"
import styled from "styled-components"
import { Container, Row } from "shards-react"
import Web3Modal from "@components/Web3Modal"
import Web3 from "web3"
import { useActiveWeb3React } from "@hooks/index"
import {useSelectNetwork } from '@state/application/hooks'
import {NetworkSymbolEnum, NetworkSymbolAndId, ARBITRUM_ETH_RPC} from '@config/constants'

const StyledContainer = styled(Container)`
  width: 100%;
  max-width: 1600px;
`

const RowContainer = styled(Row)`
  flex-wrap: inherit;
  padding: 65px 80px;
  justify-content: center;

  @media ${({ theme }) => theme.media.tablet} {
    width: 100%;
  }
`

const GlobalLayout: React.FC = (props: any) => {
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
    console.log(chainId, 'chainId pls')
    if(chainId) {
      selectNetwork(NetworkSymbolAndId[chainId!])
    } else {
      selectNetwork(NetworkSymbolEnum.ETH)
    }
  }, [chainId])

  return (
    <React.Fragment>
      <GlobalStyles />
      <Helmet title={"Abacus Protocol"} />
      <StyledContainer>
        <Navbar location={props.location}/>
        <RowContainer>
          <Web3Modal />
          {props.children}
        </RowContainer>
      </StyledContainer>
    </React.Fragment>
  )
}

export default GlobalLayout
