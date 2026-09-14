import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const RemoveUserDocument = graphql(`
  mutation RemoveUser($userId: Int!) {
    removeUser(userId: $userId)
  }
`)
