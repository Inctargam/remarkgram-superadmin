import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const BanUserDocument = graphql(`
  mutation BanUser($banReason: String!, $userId: Int!) {
    banUser(banReason: $banReason, userId: $userId)
  }
`)
