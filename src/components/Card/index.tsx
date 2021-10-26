import React from 'react'
import styled from 'styled-components'
import Countdown from 'react-countdown';
import {User} from 'react-feather'
import EthSymbol from '../../images/eth_symbol.svg'
import {Text} from '@components/global.styles'
import Link from 'gatsby-link'

const CardContainer = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 14px;
  transition: 0.2s;
  opacity: 1.0;
  
  &.hover {
    opacity: 0.6;
  }
`

const ImageContainer = styled.div<{src: string}>`
  width: 240px;
  height: 240px;
  object-fit: contain;
  border: 1px solid #C3C8D7;
  background-image: url(${({src}) => src});
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 7px;
`

const MiniText = styled.div`
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  color: ${({theme}) => theme.colors.text3};
`

interface CardProps {
  img: any
  endTime: Date
  numPpl: number
  title: string
  totalStaked: number
  nftName: string
  address: string
  tokenId: string
}

export default (props: CardProps) => {
  return (
    <CardContainer as={Link} to={`/session/${props.address}/${props.tokenId}`}>
      <ImageContainer src={props.img}>
        <MiniText>
          <Countdown
            date={props.endTime}
            renderer={({ hours, minutes, seconds, completed }) => {
              if (completed) {
                return <>Completed</>;
              } else {
                return <span>{hours}:{minutes}:{seconds}</span>;
              }}}
          />
        </MiniText>
        <MiniText>
            <User /> {props.numPpl}
        </MiniText>
      </ImageContainer>
      <Text>{props.nftName} #{props.tokenId}</Text>
      <Text><img src={EthSymbol} /> #{props.tokenId}</Text>
    </CardContainer>
  )
}