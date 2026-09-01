import { createYoga } from 'graphql-yoga'
import { beforeEach, describe, expect, it } from 'vitest'

import { ADMIN_EMAIL, ADMIN_PASSWORD, createServerSchema } from './server'

const LOGIN_ADMIN_QUERY = /* GraphQL */ `
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`

const runLoginAdmin = async (email: string, password: string) => {
  const yoga = createYoga({ schema: createServerSchema(), graphqlEndpoint: '/api/graphql' })

  const response = await yoga.handleRequest(
    new Request('http://localhost:3001/api/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: LOGIN_ADMIN_QUERY,
        variables: { email, password },
      }),
    }),
    {}
  )

  return (await response.json()) as { data?: { loginAdmin: { logged: boolean } } }
}

describe('loginAdmin resolver', () => {
  beforeEach(() => {
    createServerSchema()
  })

  it('logs in the admin with hardcoded credentials', async () => {
    const result = await runLoginAdmin(ADMIN_EMAIL, ADMIN_PASSWORD)

    expect(result.data).toEqual({ loginAdmin: { logged: true } })
  })

  it('returns logged: false for invalid credentials', async () => {
    const result = await runLoginAdmin('wrong@gmail.com', 'wrong')

    expect(result.data).toEqual({ loginAdmin: { logged: false } })
  })

  it('returns logged: false for wrong email with correct password', async () => {
    const result = await runLoginAdmin('wrong@gmail.com', ADMIN_PASSWORD)

    expect(result.data).toEqual({ loginAdmin: { logged: false } })
  })

  it('returns logged: false for correct email with wrong password', async () => {
    const result = await runLoginAdmin(ADMIN_EMAIL, 'wrong')

    expect(result.data).toEqual({ loginAdmin: { logged: false } })
  })
})
