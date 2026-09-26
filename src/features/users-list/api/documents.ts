import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const RemoveUserDocument = graphql(`
  mutation RemoveUser($userId: Int!) {
    removeUser(userId: $userId)
  }
`)

export const BanUserDocument = graphql(`
  mutation BanUser($userId: Int!, $banReason: String!) {
    banUser(userId: $userId, banReason: $banReason)
  }
`)

export const UnbanUserDocument = graphql(`
  mutation UnbanUser($userId: Int!) {
    unbanUser(userId: $userId)
  }
`)
