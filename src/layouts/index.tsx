import React, {useEffect} from 'react'
import Helmet from 'react-helmet'
import { GlobalStyles } from './styles'
import Navbar from '@components/Navbar'
import styled from 'styled-components'
import { Container, Row, Col } from "shards-react";
import Web3Modal from '@components/Web3Modal'
import Web3 from 'web3'

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
  useEffect(() => {
    const checkConnection = async () => {

        // Check if browser is running Metamask
        let web3: any;
        // @ts-ignore
        if (window.ethereum) {
          // @ts-ignore
            web3 = new Web3(window.ethereum);
            // @ts-ignore
        } else if (window.web3) {
          // @ts-ignore
            web3 = new Web3(window.web3.currentProvider);
        };

        // Check if User is already connected by retrieving the accounts
        web3.eth.getAccounts()
            .then(async (addr: string) => {
              console.log(addr, 'addr')
                // Set User account into state
            });
    };
    checkConnection();
}, []);
  return (
      <React.Fragment>
        <GlobalStyles />
        <Helmet title={"Abacus Protocol"} />
        <StyledContainer>
          <Navbar />
          <RowContainer>
            <Web3Modal />
            {props.children}
          </RowContainer>
        </StyledContainer>
      </React.Fragment>
  )
}

export default GlobalLayout
