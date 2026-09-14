import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const GetFollowersDocument = graphql(`
  query GetFollowers(
    $userId: Int!
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getFollowers(
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        userName
        firstName
        lastName
        createdAt
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`)

export const GetFollowingDocument = graphql(`
  query GetFollowing(
    $userId: Int!
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getFollowing(
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        userName
        firstName
        lastName
        createdAt
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`)
