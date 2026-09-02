import { createYoga } from 'graphql-yoga'
import { describe, expect, it } from 'vitest'

import { ADMIN_EMAIL, ADMIN_PASSWORD, createServerSchema } from './server'

const LOGIN_ADMIN_QUERY = /* GraphQL */ `
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`

const GET_USERS_QUERY = /* GraphQL */ `
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
          firstName
          lastName
        }
        userBan {
          reason
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
`

type GetUsersData = {
  data?: {
    getUsers: {
      users: Array<{
        id: number
        userName: string
        createdAt: string
        profile: { firstName: string; lastName: string }
        userBan: { reason: string } | null
      }>
      pagination: {
        pagesCount: number
        page: number
        pageSize: number
        totalCount: number
      }
    }
  }
}

const runGraphQL = async (query: string, variables?: Record<string, unknown>) => {
  const yoga = createYoga({ schema: createServerSchema(), graphqlEndpoint: '/api/graphql' })

  const response = await yoga.handleRequest(
    new Request('http://localhost:3001/api/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    }),
    {}
  )

  return response.json() as Promise<GetUsersData & { data?: { loginAdmin: { logged: boolean } } }>
}

const runLoginAdmin = (email: string, password: string) =>
  runGraphQL(LOGIN_ADMIN_QUERY, { email, password })

const runGetUsers = (variables: Record<string, unknown>) => runGraphQL(GET_USERS_QUERY, variables)

describe('loginAdmin resolver', () => {
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

describe('getUsers resolver', () => {
  it('returns 8 users with 10 pages for the first page ordered by createdAt desc', async () => {
    const result = await runGetUsers({ pageNumber: 1, pageSize: 8 })

    expect(result.data?.getUsers.users).toHaveLength(8)
    expect(result.data?.getUsers.users[0].userName).toBe('Ivan.sr.yakimenko')
    expect(result.data?.getUsers.pagination).toEqual({
      pagesCount: 10,
      page: 1,
      pageSize: 8,
      totalCount: 80,
    })
  })

  it('returns the last page of 8 users', async () => {
    const result = await runGetUsers({ pageNumber: 10, pageSize: 8 })

    expect(result.data?.getUsers.users).toHaveLength(8)
    expect(result.data?.getUsers.users[0].userName).toBe('user-73')
  })

  it('returns an empty list for a page beyond the last one', async () => {
    const result = await runGetUsers({ pageNumber: 11, pageSize: 8 })

    expect(result.data?.getUsers.users).toEqual([])
    expect(result.data?.getUsers.pagination.pagesCount).toBe(10)
    expect(result.data?.getUsers.pagination.page).toBe(11)
  })

  it('sorts users by userName in asc and desc order', async () => {
    const asc = await runGetUsers({
      pageNumber: 1,
      pageSize: 8,
      sortBy: 'userName',
      sortDirection: 'asc',
    })
    const desc = await runGetUsers({
      pageNumber: 1,
      pageSize: 8,
      sortBy: 'userName',
      sortDirection: 'desc',
    })

    expect(asc.data?.getUsers.users[0].userName).toBe('Anna_Votakaya')
    expect(desc.data?.getUsers.users[0].userName).toBe('user-9')
  })

  it('filters users by a search term on userName', async () => {
    const result = await runGetUsers({ pageNumber: 1, pageSize: 8, searchTerm: 'ivan' })

    expect(result.data?.getUsers.users).toHaveLength(1)
    expect(result.data?.getUsers.users[0].userName).toBe('Ivan.sr.yakimenko')
  })

  it('filters blocked and unblocked users', async () => {
    const blocked = await runGetUsers({ pageNumber: 1, pageSize: 8, statusFilter: 'BLOCKED' })
    const unblocked = await runGetUsers({ pageNumber: 1, pageSize: 8, statusFilter: 'UNBLOCKED' })

    expect(blocked.data?.getUsers.users.every((user) => user.userBan)).toBe(true)
    expect(blocked.data?.getUsers.pagination.totalCount).toBe(6)
    expect(unblocked.data?.getUsers.users.every((user) => !user.userBan)).toBe(true)
    expect(unblocked.data?.getUsers.pagination.totalCount).toBe(74)
  })

  it('uses the contract defaults when arguments are omitted', async () => {
    const result = await runGetUsers({})

    expect(result.data?.getUsers.users).toHaveLength(10)
    expect(result.data?.getUsers.pagination.pageSize).toBe(10)
    expect(result.data?.getUsers.pagination.totalCount).toBe(80)
  })
})
