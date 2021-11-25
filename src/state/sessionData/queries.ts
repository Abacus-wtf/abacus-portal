import { gql } from "graphql-request"
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
  pricingSessions: SubgraphPricingSession[]
}

export type GetPricingSessionsVariables = {
  first: number
  skip: number
}

export type PricingSessionFilters = {
  nftAddress?: string
  tokenId?: string
  sessionStatuses?: number[]
}

export const GET_PRICING_SESSIONS = (filters: PricingSessionFilters) => {
  const where =
    filters.nftAddress || filters.tokenId || filters.sessionStatuses
      ? `{
          ${filters.nftAddress ? `nftAddress: "${filters.nftAddress}",` : ""}
          ${filters.tokenId ? `tokenId: ${filters.tokenId},` : ""}
          ${
            filters.sessionStatuses
              ? `sessionStatus_in: [${filters.sessionStatuses}],`
              : ""
          }
        }`
      : null

  const query = gql`
    query GetPricingSessions($first: Int!, $skip: Int!) {
      pricingSessions(first: $first, orderBy: createdAt, skip: $skip, where: ${where}) {
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
  console.log(query)
  return query
}

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
