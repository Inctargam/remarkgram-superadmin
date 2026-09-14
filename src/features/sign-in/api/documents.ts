import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const LoginAdminDocument = graphql(`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`)
