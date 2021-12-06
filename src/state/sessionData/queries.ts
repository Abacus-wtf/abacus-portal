import { gql } from "graphql-request"
import { Vote } from "./reducer"

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
  maxAppraisal: number
  participants: Vote[]
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
  tokenId?: number
  sessionStatus?: number[]
}

export const pricingSessionWhere = (
  filters: PricingSessionFilters
): string | null => {
  const hasFilters = Object.values(filters).some((filter) =>
    Boolean(Array.isArray(filter) ? filter.length : filter)
  )
  if (!hasFilters) {
    return null
  }
  const filterString = Object.keys(filters).reduce((acc, filter) => {
    const filterValue = filters[filter]
    switch (typeof filterValue) {
      case "string":
        return `${acc}${filter}: "${filterValue}",`
      case "number":
        return `${acc}${filter}: ${filterValue},`
      case "object":
        if (Array.isArray(filterValue)) {
          return `${acc}${filter}_in: [${filterValue}],`
        }
        return acc
      default:
        return acc
    }
  }, "")
  return `{ ${filterString} }`
}

export const GET_PRICING_SESSIONS = (where: string | null) => gql`
  query GetPricingSessions($first: Int!, $skip: Int!) {
    pricingSessions(
      first: $first
      orderBy: createdAt
      orderDirection: desc
      skip: $skip
      where: ${where}
    ) {
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
      maxAppraisal
      participants {
        user {
          id
        }
        amountStaked
        appraisal
      }
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
      maxAppraisal
      participants {
        user {
          id
        }
        amountStaked
        appraisal
      }
    }
  }
`

export type GetMySessionsQueryResponse = {
  user: {
    creatorOf: SubgraphPricingSession[]
  } | null
}

export type GetMySessionsVariables = {
  userId: string
  first: number
  skip: number
}

export const GET_MY_SESSIONS = (where: string | null) => gql`
  query GetMySessions($userId: ID!, $first: Int!, $skip: Int!) {
    user(id: $userId) {
      creatorOf(
        first: $first
        orderBy: createdAt
        orderDirection: desc
        skip: $skip
        where: ${where}
      ) {
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
        maxAppraisal
        participants {
          user {
            id
          }
          amountStaked
          appraisal
        }
      }
    }
  }
`

export type GetActiveSessionsQueryResponse = {
  user: {
    pricingSessionsVotedIn: SubgraphPricingSession[]
  } | null
}

export type GetActiveSessionsVariables = {
  userId: string
  first: number
  skip: number
}

export const GET_ACTIVE_SESSIONS = (where: string | null) => gql`
  query GetActiveSessions($userId: ID!, $first: Int!, $skip: Int!) {
    user(id: $userId) {
      pricingSessionsVotedIn(
        first: $first
        orderBy: createdAt
        orderDirection: desc
        skip: $skip
        where: ${where}
      ) {
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
        maxAppraisal
        participants {
          user {
            id
          }
          amountStaked
          appraisal
        }
      }
    }
  }
`
