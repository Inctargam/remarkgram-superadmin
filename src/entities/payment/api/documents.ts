import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const GetPaymentsByUserDocument = graphql(`
  query GetPaymentsByUser(
    $userId: Int!
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getPaymentsByUser(
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        status
        dateOfPayment
        endDate
        type
        price
        paymentType
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`)
