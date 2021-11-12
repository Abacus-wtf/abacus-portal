export type SubgraphPricingSession = {
  id: string
  nftAddress: string
  tokenId: string
  nonce: string
  finalAppraisalValue: number
  totalStaked: number
  bounty: number
  votingTime: number
  endTime: number
  sessionStatus: number
  numParticipants: number
  maxAppraisal?: number
}

export type GetPricingSessionsQueryResponse = {
  data: {
    pricingSessions: SubgraphPricingSession[]
  }
}

export const GET_PRICING_SESSIONS = `
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
