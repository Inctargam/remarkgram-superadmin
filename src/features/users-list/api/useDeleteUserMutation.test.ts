import { ApolloClient, InMemoryCache } from '@apollo/client'
import { MockLink } from '@apollo/client/testing'
import { describe, expect, it, vi } from 'vitest'

import { GetUsersDocument } from '@/entities/user'

import { RemoveUserDocument } from './documents'

const USERS_VARIABLES = { pageNumber: 1, pageSize: 8 }

const buildUsersResult = (totalCount: number) => ({
  data: {
    getUsers: {
      __typename: 'UsersPaginationModel' as const,
      users: [
        {
          __typename: 'User' as const,
          id: 1,
          userName: 'Ivan.sr.yakimenko',
          createdAt: '2022-12-12T23:59:00Z',
          profile: {
            __typename: 'Profile' as const,
            id: 1,
            firstName: 'Ivan',
            lastName: 'Yakymenko',
          },
          userBan: null,
        },
      ],
      pagination: {
        __typename: 'PaginationModel' as const,
        pagesCount: 1,
        page: 1,
        pageSize: 8,
        totalCount,
      },
    },
  },
})

describe('removeUser cache synchronization', () => {
  it('refetches the active users list after removing a user', async () => {
    const getUsersSpy = vi.fn()

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new MockLink([
        {
          request: { query: GetUsersDocument, variables: USERS_VARIABLES },
          maxUsageCount: 2,
          result: () => {
            getUsersSpy()

            return buildUsersResult(getUsersSpy.mock.calls.length === 1 ? 2 : 1)
          },
        },
        {
          request: { query: RemoveUserDocument, variables: { userId: 1 } },
          result: { data: { removeUser: true } },
        },
      ]),
    })

    const observable = client.watchQuery({
      query: GetUsersDocument,
      variables: USERS_VARIABLES,
    })

    let resolveInitialLoad: () => void = () => {}

    const initialLoad = new Promise<void>((resolve) => {
      resolveInitialLoad = resolve
    })

    const subscription = observable.subscribe({
      next: (result) => {
        if (result.data) {
          resolveInitialLoad()
        }
      },
    })

    await initialLoad
    expect(getUsersSpy).toHaveBeenCalledTimes(1)

    await client.mutate({
      mutation: RemoveUserDocument,
      variables: { userId: 1 },
      refetchQueries: ['GetUsers'],
      awaitRefetchQueries: true,
    })

    expect(getUsersSpy).toHaveBeenCalledTimes(2)
    subscription.unsubscribe()
  })
})
