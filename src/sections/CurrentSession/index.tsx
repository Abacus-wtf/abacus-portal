import React, {useEffect, useState, useContext, FormEvent} from 'react';
import { Title, SmallUniversalContainer, Text } from '@components/global.styles'
import styled, {ThemeContext} from 'styled-components'
import * as queryString from "query-string";
import { navigate } from "gatsby"
import {ImageContainer, Label} from '@components/global.styles'
import Button from '@components/Button'
import { useSelector } from 'react-redux'
import {AppState} from '@state/index'
import {useGetCurrentSessionData} from '@state/sessionData/hooks'
import Loader from 'react-loader'
import {HorizontalListGroup, ListGroupHeader, ListGroupSubtext} from '@components/ListGroupMods'
import { ButtonsWhite } from '@components/Button';
import {ListGroupItem, ListGroup, Form} from 'shards-react'
import Link from'gatsby-link'
import Countdown from 'react-countdown'
import {InputWithTitle} from '@components/Input'
import {User} from 'react-feather'
import HashSystem from './hashSystem'

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-gap: 40px;
  width: 100%;
  
  @media ${({theme}) => theme.media.splitCenter} {
    grid-template-columns: 1fr;
  }
`

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: 15px;
`

const VerticalSmallGapContainer = styled(VerticalContainer)`
  grid-gap: 2px;
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
  const theme = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(true)
  const [appraisalHash, setAppraisalHash] = useState('')
  
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
        <VerticalContainer>
          <SquareImageContainer src={sessionData.img} />
          <ButtonsWhite style={{borderRadius: 8}} target={'_blank'} to={`https://opensea.io/${sessionData.address}/${sessionData.tokenId}`} as={Link}>OpenSea</ButtonsWhite>
        </VerticalContainer>
        <VerticalContainer>
          <VerticalSmallGapContainer>
            <SubText>{sessionData.title}</SubText>
            <Title>{sessionData.nftName} #{sessionData.tokenId}</Title>
            <SubText>Owned by <Link to={`https://opensea.io/${sessionData.owner}`}>{sessionData.owner}</Link></SubText>
          </VerticalSmallGapContainer>
          <HorizontalListGroup>
            <ListGroupItem style={{paddingRight: 50}}>
              <Label>Total Staked</Label>
              <ListGroupHeader style={{color: theme.colors.accent}}>{sessionData.totalStaked} ETH</ListGroupHeader>
              <ListGroupSubtext>(${sessionData.totalStakedInUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})})</ListGroupSubtext>
            </ListGroupItem>
            <ListGroupItem style={{width: '100%'}}>
              <Label>Session ends in</Label>
              <Countdown
                date={sessionData.endTime}
                renderer={({ hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return <ListGroupHeader>Completed</ListGroupHeader>;
                  } else {
                    const colon = <ListGroupHeader style={{color: theme.colors.text2, margin: '0px 10px'}}>:</ListGroupHeader>
                    return (
                        <div style={{display: 'flex'}}>
                          <div>
                            <ListGroupHeader>{hours}</ListGroupHeader>
                            <ListGroupSubtext>Hr</ListGroupSubtext>
                          </div>
                          {colon}
                          <div>
                            <ListGroupHeader>{minutes}</ListGroupHeader>
                            <ListGroupSubtext>Min</ListGroupSubtext>
                          </div>
                          {colon}
                          <div>
                            <ListGroupHeader>{seconds}</ListGroupHeader>
                            <ListGroupSubtext>Sec</ListGroupSubtext>
                          </div>
                        </div>
                    )
                  }}}
              />
            </ListGroupItem>
          </HorizontalListGroup>
          <Form onSubmit={(e: FormEvent<HTMLDivElement>) => {
              e.preventDefault()
              console.log(e.target['appraise'].value)
              console.log(e.target['stake'].value)
            }}>
            <ListGroup>
              <HashSystem onCreateHash={(appraisalValue, password) => {
                setAppraisalHash('0x')
              }}/>
              <ListGroupItem>
                <InputWithTitle 
                  title={'Appraisal Result (Hashed)'}
                  id={'appraise'}
                  placeholder="0"
                  disabled={true}
                  value={appraisalHash}
                />
              </ListGroupItem>
              <ListGroupItem>
                <InputWithTitle 
                  title={'Stake'}
                  id={'stake'}
                  placeholder="0"
                />
              </ListGroupItem>
            </ListGroup>
            <VerticalContainer style={{marginTop: 35, alignItems: 'center'}}>
              <Button style={{width: '100%'}} type="submit">
                Submit
              </Button>
              <SubText style={{display: 'flex', alignItems: 'center'}}>
                <User style={{height: 14}} /> {sessionData.numPpl} participants
              </SubText>
            </VerticalContainer>
          </Form>
        </VerticalContainer>
      </SplitContainer>
    </SmallUniversalContainer>
  )
}

export default CurrentSession
