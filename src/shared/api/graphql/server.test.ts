import { createYoga } from 'graphql-yoga'
import { beforeEach, describe, expect, it } from 'vitest'

import { ADMIN_EMAIL, ADMIN_PASSWORD, createServerSchema, resetMockUsers } from './server'

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

const GET_USER_QUERY = /* GraphQL */ `
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      id
      userName
      createdAt
      profile {
        firstName
        lastName
        avatars {
          url
          width
          height
        }
      }
      userBan {
        reason
      }
    }
  }
`

const GET_PAYMENTS_BY_USER_QUERY = /* GraphQL */ `
  query GetPaymentsByUser($userId: Int!, $pageSize: Int, $pageNumber: Int) {
    getPaymentsByUser(userId: $userId, pageSize: $pageSize, pageNumber: $pageNumber) {
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
`

const GET_FOLLOWERS_QUERY = /* GraphQL */ `
  query GetFollowers(
    $userId: Int!
    $pageSize: Int
    $pageNumber: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getFollowers(
      userId: $userId
      pageSize: $pageSize
      pageNumber: $pageNumber
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        userName
        createdAt
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`

const GET_FOLLOWING_QUERY = /* GraphQL */ `
  query GetFollowing($userId: Int!, $pageSize: Int, $pageNumber: Int) {
    getFollowing(userId: $userId, pageSize: $pageSize, pageNumber: $pageNumber) {
      items {
        id
        userId
        userName
        createdAt
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`

const GET_POSTS_BY_USER_QUERY = /* GraphQL */ `
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
`

type FollowItemsData = {
  data?: {
    getFollowers: {
      items: Array<{ id: number; userId: number; userName: string; createdAt: string }>
      pagination: { pagesCount: number; page: number; pageSize: number; totalCount: number }
    }
    getFollowing: {
      items: Array<{ id: number; userId: number; userName: string; createdAt: string }>
      pagination: { pagesCount: number; page: number; pageSize: number; totalCount: number }
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

  return response.json() as Promise<
    GetUsersData & FollowItemsData & { data?: { loginAdmin: { logged: boolean } } }
  >
}

const runLoginAdmin = (email: string, password: string) =>
  runGraphQL(LOGIN_ADMIN_QUERY, { email, password })

const runGetUsers = (variables: Record<string, unknown>) => runGraphQL(GET_USERS_QUERY, variables)

const REMOVE_USER_MUTATION = /* GraphQL */ `
  mutation RemoveUser($userId: Int!) {
    removeUser(userId: $userId)
  }
`

const runRemoveUser = (userId: number) => runGraphQL(REMOVE_USER_MUTATION, { userId })

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
  beforeEach(() => {
    resetMockUsers()
  })

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

describe('removeUser resolver', () => {
  beforeEach(() => {
    resetMockUsers()
  })

  it('removes the user and reports it in the listing', async () => {
    const removal = await runRemoveUser(1)

    expect(removal.data).toEqual({ removeUser: true })

    const result = await runGetUsers({ pageNumber: 1, pageSize: 8 })

    expect(result.data?.getUsers.users.some((user) => user.id === 1)).toBe(false)
    expect(result.data?.getUsers.pagination.totalCount).toBe(79)
  })

  it('returns false for an unknown user id', async () => {
    const result = await runRemoveUser(9999)

    expect(result.data).toEqual({ removeUser: false })
  })

  it('returns false when the user was already removed', async () => {
    const first = await runRemoveUser(1)
    const second = await runRemoveUser(1)

    expect(first.data).toEqual({ removeUser: true })
    expect(second.data).toEqual({ removeUser: false })
  })
})

describe('user detail resolvers', () => {
  beforeEach(() => {
    resetMockUsers()
  })

  it('returns a user with avatar profile', async () => {
    const result = (await runGraphQL(GET_USER_QUERY, { userId: 1 })) as {
      data?: { getUser: { userName: string; profile: { avatars: Array<{ url: string }> } } }
    }

    expect(result.data?.getUser.userName).toBe('Ivan.sr.yakimenko')
    expect(result.data?.getUser.profile.avatars[0].url).toMatch(/pravatar\.cc/)
  })

  it('throws an error for an unknown user', async () => {
    const result = (await runGraphQL(GET_USER_QUERY, { userId: 9999 })) as {
      data?: { getUser?: unknown }
      errors?: unknown[]
    }

    expect(result.data?.getUser).toBeUndefined()
    expect(result.errors).toBeTruthy()
  })

  it('returns payments with two pages', async () => {
    const result = (await runGraphQL(GET_PAYMENTS_BY_USER_QUERY, {
      userId: 1,
      pageSize: 8,
      pageNumber: 1,
    })) as {
      data?: {
        getPaymentsByUser: {
          items: Array<{ price: number; type: string; paymentType: string }>
          pagesCount: number
          page: number
          pageSize: number
          totalCount: number
        }
      }
    }

    expect(result.data?.getPaymentsByUser.items).toHaveLength(8)
    expect(result.data?.getPaymentsByUser).toMatchObject({
      pagesCount: 2,
      page: 1,
      pageSize: 8,
      totalCount: 12,
    })
    expect(result.data?.getPaymentsByUser.items.some((item) => item.price === 10)).toBe(true)
    expect(result.data?.getPaymentsByUser.items.some((item) => item.price === 50)).toBe(true)
  })

  it('returns followers with pagination', async () => {
    const result = (await runGraphQL(GET_FOLLOWERS_QUERY, {
      userId: 1,
      pageSize: 8,
      pageNumber: 1,
    })) as {
      data?: {
        getFollowers: {
          items: Array<{ userName: string }>
          pagesCount: number
          totalCount: number
        }
      }
    }

    expect(result.data?.getFollowers.items).toHaveLength(8)
    expect(result.data?.getFollowers).toMatchObject({
      pagesCount: 2,
      totalCount: 15,
    })
  })

  it('sorts followers by userName', async () => {
    const asc = (await runGraphQL(GET_FOLLOWERS_QUERY, {
      userId: 1,
      pageSize: 8,
      sortBy: 'userName',
      sortDirection: 'asc',
    })) as { data?: { getFollowers: { items: Array<{ userName: string }> } } }
    const desc = (await runGraphQL(GET_FOLLOWERS_QUERY, {
      userId: 1,
      pageSize: 8,
      sortBy: 'userName',
      sortDirection: 'desc',
    })) as { data?: { getFollowers: { items: Array<{ userName: string }> } } }

    expect(asc.data?.getFollowers.items[0].userName).toBe('Anna_Votakaya')
    expect(desc.data?.getFollowers.items[0].userName).toBe('user-9')
  })

  it('returns following symmetric to followers', async () => {
    const result = (await runGraphQL(GET_FOLLOWING_QUERY, {
      userId: 1,
      pageSize: 8,
      pageNumber: 1,
    })) as {
      data?: {
        getFollowing: {
          items: Array<{ userName: string }>
          pagesCount: number
          totalCount: number
        }
      }
    }

    expect(result.data?.getFollowing.items[0].userName).toBe('user-17')
    expect(result.data?.getFollowing).toMatchObject({
      pagesCount: 2,
      totalCount: 15,
    })
  })

  it('returns twelve posts for the uploads grid', async () => {
    const result = (await runGraphQL(GET_POSTS_BY_USER_QUERY, { userId: 1 })) as {
      data?: { getPostsByUser: { items: Array<{ url: string }>; totalCount: number } }
    }

    expect(result.data?.getPostsByUser.items).toHaveLength(12)
    expect(result.data?.getPostsByUser.items[0].url).toMatch(/picsum\.photos/)
    expect(result.data?.getPostsByUser.totalCount).toBe(12)
  })
})
