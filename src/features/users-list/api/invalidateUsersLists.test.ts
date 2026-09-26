import { ApolloClient, InMemoryCache } from '@apollo/client'
import { MockLink } from '@apollo/client/testing'
import { describe, expect, it } from 'vitest'

import { GetUsersDocument } from '@/entities/user'

import { invalidateUsersLists } from './invalidateUsersLists'

const allVariables = { pageNumber: 1, pageSize: 8, statusFilter: 'ALL' as const }
const unblockedVariables = { pageNumber: 1, pageSize: 8, statusFilter: 'UNBLOCKED' as const }

const usersResult = (userIds: number[], totalCount: number) => ({
  getUsers: {
    users: userIds.map((id) => ({
      id,
      userName: `user-${id}`,
      createdAt: '2022-12-12T23:59:00Z',
      profile: { id, firstName: 'Test', lastName: 'User' },
      userBan: null,
    })),
    pagination: { pagesCount: Math.ceil(totalCount / 8), page: 1, pageSize: 8, totalCount },
  },
})

describe('users list cache invalidation', () => {
  it('drops previously visited filters after a successful block status change', async () => {
    const cache = new InMemoryCache()
    const client = new ApolloClient({
      cache,
      link: new MockLink([
        {
          request: { query: GetUsersDocument, variables: unblockedVariables },
          result: { data: usersResult([1], 73) },
        },
      ]),
    })

    cache.writeQuery({
      query: GetUsersDocument,
      variables: unblockedVariables,
      data: usersResult([1, 2], 74),
    })
    cache.writeQuery({
      query: GetUsersDocument,
      variables: allVariables,
      data: usersResult([1, 2], 80),
    })

    expect(
      cache.readQuery({ query: GetUsersDocument, variables: unblockedVariables })?.getUsers
        .pagination.totalCount
    ).toBe(74)

    invalidateUsersLists(cache, true)

    expect(cache.readQuery({ query: GetUsersDocument, variables: allVariables })).toBeNull()
    expect(cache.readQuery({ query: GetUsersDocument, variables: unblockedVariables })).toBeNull()

    const result = await client.query({ query: GetUsersDocument, variables: unblockedVariables })

    expect(result.data?.getUsers.pagination.totalCount).toBe(73)
    expect(result.data?.getUsers.users.map((user) => user.id)).toEqual([1])
  })

  it('keeps cached lists when the mutation returns false', () => {
    const cache = new InMemoryCache()
    cache.writeQuery({
      query: GetUsersDocument,
      variables: unblockedVariables,
      data: usersResult([1, 2], 74),
    })

    invalidateUsersLists(cache, false)

    expect(
      cache.readQuery({ query: GetUsersDocument, variables: unblockedVariables })?.getUsers
        .pagination.totalCount
    ).toBe(74)
  })
})
