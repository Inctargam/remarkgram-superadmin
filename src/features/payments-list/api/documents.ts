import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const GetPaymentsDocument = graphql(`
  query GetPayments(
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
    $searchTerm: String
  ) {
    getPayments(
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchTerm: $searchTerm
    ) {
      items {
        id
        userName
        avatars {
          url
        }
        createdAt
        amount
        currency
        type
        paymentMethod
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`)
