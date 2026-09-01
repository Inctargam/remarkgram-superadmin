const GRAPHQL_ENDPOINT = '/api/graphql'

type GraphQLPayload<TData> = {
  data?: TData
  errors?: Array<{ message: string }>
}

export const graphqlRequest = async <TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as GraphQLPayload<TData>

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message)
  }

  return payload.data as TData
}

export type LoginAdminInput = {
  email: string
  password: string
}

type LoginAdminData = {
  loginAdmin: {
    logged: boolean
  }
}

const LOGIN_ADMIN_MUTATION = /* GraphQL */ `
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`

export const loginAdmin = async (input: LoginAdminInput): Promise<boolean> => {
  const data = await graphqlRequest<LoginAdminData>(LOGIN_ADMIN_MUTATION, input)

  return data.loginAdmin.logged
}
