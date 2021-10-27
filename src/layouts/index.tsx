import * as React from 'react'
import Helmet from 'react-helmet'
import { GlobalStyles } from './styles'
import Navbar from '@components/Navbar'
import styled from 'styled-components'
import { Container, Row, Col } from "shards-react";

const StyledContainer = styled(Container)`
  width: 100%;
  max-width: 1600px;
`

const RowContainer = styled(Row)`
  flex-wrap: inherit;
  padding: 65px 80px;
  justify-content: center;

  @media ${({theme}) => theme.media.tablet} {
    width: 100%;
  }
`

const GlobalLayout: React.FC = (props: any) => {
    return (
        <React.Fragment>
            <GlobalStyles />
            <Helmet title={"Abacus Protocol"} />
            <StyledContainer>
              <Navbar />
              <RowContainer>
                {props.children}
              </RowContainer>
            </StyledContainer>
        </React.Fragment>
    )
}

export default GlobalLayout;