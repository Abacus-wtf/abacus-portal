import React from "react"
import styled from "styled-components"
import Countdown from "react-countdown"
import { User } from "react-feather"
import EthSymbol from "@images/ETH.svg"
import { Text, ImageContainer } from "@components/global.styles"
import Link from "gatsby-link"
import { SessionData } from "@state/sessionData/reducer"

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 14px;
  transition: 0.2s;
  opacity: 1;
  overflow: hidden;

  &:hover {
    opacity: 0.6;
  }
`

const MiniText = styled.div`
  background: rgba(0, 0, 0, 0.65);
  max-height: min-content;
  border-radius: 35px;
  padding: 4px 10px;
  max-height: 30px;
  font-size: 14px;
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.text3};
`

const UserStyled = styled(User)`
  height: 13px;
  width: 16px;
  margin-top: -2px;
`

const OuterTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: 4px;
`

const TextContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  grid-gap: 20px;
`

const BoldText = styled(Text)`
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SubText = styled(Text)`
  color: ${({ theme }) => theme.colors.text2};
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const EthText = styled(BoldText)`
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  grid-gap: 5px;
  align-items: center;
  margin-bottom: -1px;
`

export default (props: SessionData) => {
  return (
    <CardContainer
      as={Link}
      to={`/current-session?address=${props.address}&tokenId=${props.tokenId}&nonce=${props.nonce}`}
    >
      <ImageContainer src={props.img}>
        <MiniText>
          <Countdown
            date={props.endTime}
            renderer={({ hours, minutes, seconds, completed }) => {
              if (completed) {
                return <>Completed</>
              } else {
                return (
                  <span>
                    {hours}:{minutes}:{seconds}
                  </span>
                )
              }
            }}
          />
        </MiniText>
        <MiniText>
          <UserStyled /> {props.numPpl}
        </MiniText>
      </ImageContainer>
      <OuterTextContainer>
        <TextContainer>
          <BoldText>
            {props.nftName} #{props.tokenId}
          </BoldText>
          <EthText>
            <img style={{ height: 15 }} src={EthSymbol} /> {props.totalStaked}
          </EthText>
        </TextContainer>
        <TextContainer>
          <SubText style={{ maxWidth: "min-content", overflow: "hidden" }}>
            {props.collectionTitle}
          </SubText>
          <SubText>Total Staked</SubText>
        </TextContainer>
      </OuterTextContainer>
    </CardContainer>
  )
}
