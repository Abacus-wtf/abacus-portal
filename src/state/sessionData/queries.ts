import { PAGINATE_BY } from "./constants"

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
  timeFinalAppraisalSet: number
  maxAppraisal?: number
}

export type GetPricingSessionsQueryResponse = {
  data: {
    pricingSessions: SubgraphPricingSession[]
  }
}

export const GET_PRICING_SESSIONS = (page: number) => `
  query GetPricingSessions {
    pricingSessions(first: ${PAGINATE_BY}, orderBy: createdAt, skip: ${
  page * PAGINATE_BY
}) {
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
      timeFinalAppraisalSet
      numParticipants
    }
  }
`

export type GetPricingSessionQueryResponse = {
  data: {
    pricingSession: SubgraphPricingSession
  }
}

export const GET_PRICING_SESSION = (id: string) => `
  query GetPricingSession {
    pricingSession(id: "${id}") {
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
      timeFinalAppraisalSet
      numParticipants
    }
  }
`

export type GetMySessionsQueryResponse = {
  data: {
    user: {
      creatorOf: SubgraphPricingSession[]
    } | null
  }
}

export const GET_MY_SESSIONS = (userId: string, page: number) => `
  query GetMySessions {
    user(id: "${userId}") {
      creatorOf(first: ${PAGINATE_BY}, orderBy: createdAt, skip: ${
  page * PAGINATE_BY
}) {
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
        timeFinalAppraisalSet
        numParticipants
      }
    }
  }
`

export type GetActiveSessionsQueryResponse = {
  data: {
    user: {
      votes: { pricingSession: SubgraphPricingSession }[]
    } | null
  }
}

export const GET_ACTIVE_SESSIONS = (userId: string, page: number) => `
  query GetActiveSessions {
    user(id: "${userId}") {
      votes(first: ${PAGINATE_BY}, skip: ${page * PAGINATE_BY}) {
        pricingSession {
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
          timeFinalAppraisalSet
          numParticipants
        }
      }
    }
  }
`
