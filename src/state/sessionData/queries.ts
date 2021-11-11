import { gql } from "@apollo/client"

export const GET_PRICING_SESSIONS = gql`
  query GetPricingSessions {
    pricingSessions(first: 20) {
      id
      nftAddress
      tokenId
      nonce
      finalAppraisalValue
      totalStaked
      bounty
      votingTime
      endTime
      sessionStatus
      numParticipants
    }
  }
`
