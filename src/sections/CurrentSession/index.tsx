import React, {useEffect, useState} from 'react';
import { Title, SmallUniversalContainer, Text } from '@components/global.styles'
import styled from 'styled-components'
import * as queryString from "query-string";
import { navigate } from "gatsby"
import {ImageContainer} from '@components/global.styles'
import { useSelector } from 'react-redux'
import {AppState} from '@state/index'
import {useGetCurrentSessionData} from '@state/sessionData/hooks'
import Loader from 'react-loader'
import { ButtonsWhite } from '@components/Button';
import Link from'gatsby-link'

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-gap: 40px;
  width: 100%;
`

const SessionMetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: 15px;
`

const SquareImageContainer = styled(ImageContainer)`
  max-height: 450px;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`

const SubText = styled(Text)`
  color: ${({theme}) => theme.colors.text2};
  text-align: left;
`

const CurrentSession = ({location}) => {
  const getCurrentSessionData = useGetCurrentSessionData()
  const sessionData = useSelector<AppState, AppState['sessionData']['currentSessionData']>(state => state.sessionData.currentSessionData)
  const { address, tokenId } = queryString.parse(location.search);
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await getCurrentSessionData()
      setIsLoading(false)
    }
    if (address === undefined || tokenId === undefined) {
      alert('This is a broken link, we are redirecting you to the home page.')
      navigate('/')
    } else {
      loadData()
    }
  }, [address, tokenId])

  if (isLoading || sessionData === null) {
    return (
      <SmallUniversalContainer style={{alignItems: 'center', justifyContent: 'center'}}>
        <Loader />
      </SmallUniversalContainer>
    )
  }

  return (
    <SmallUniversalContainer style={{alignItems: 'center'}}>
      <SplitContainer>
        <SessionMetadataContainer>
          <SquareImageContainer src={sessionData.img} />
          <ButtonsWhite style={{borderRadius: 8}} target={'_blank'} to={`https://opensea.io/${sessionData.address}/${sessionData.tokenId}`} as={Link}>OpenSea</ButtonsWhite>
        </SessionMetadataContainer>
        <SessionMetadataContainer>
          <SessionMetadataContainer style={{gridGap: 2}}>
            <SubText>{sessionData.title}</SubText>
            <Title>{sessionData.nftName} #{sessionData.tokenId}</Title>
            <SubText>Owned by <Link to={`https://opensea.io/${sessionData.owner}`}>{sessionData.owner}</Link></SubText>
          </SessionMetadataContainer>
        </SessionMetadataContainer>
      </SplitContainer>
    </SmallUniversalContainer>
  )
}

export default CurrentSession
