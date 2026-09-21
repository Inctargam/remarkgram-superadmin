import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const GetUsersDocument = graphql(`
  query GetUsers(
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
    $searchTerm: String
    $statusFilter: UserBlockStatus
  ) {
    getUsers(
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchTerm: $searchTerm
      statusFilter: $statusFilter
    ) {
      users {
        id
        userName
        createdAt
        profile {
          id
          firstName
          lastName
        }
        userBan {
          reason
          createdAt
        }
      }
      pagination {
        pagesCount
        page
        pageSize
        totalCount
      }
    }
  }
`)

export const GetUserDocument = graphql(`
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      id
      userName
      createdAt
      profile {
        id
        userName
        firstName
        lastName
        createdAt
        avatars {
          url
          width
          height
        }
      }
      userBan {
        reason
        createdAt
      }
    }
  }
`)
