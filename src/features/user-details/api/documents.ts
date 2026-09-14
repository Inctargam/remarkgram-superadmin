import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const GetPostsByUserDocument = graphql(`
  query GetPostsByUser($userId: Int!) {
    getPostsByUser(userId: $userId) {
      pagesCount
      pageSize
      totalCount
      items {
        id
        url
        width
        height
      }
    }
  }
`)
