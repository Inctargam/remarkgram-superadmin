import { ApolloClient, InMemoryCache } from '@apollo/client'
import { MockLink } from '@apollo/client/testing'
import { describe, expect, it, vi } from 'vitest'

import { GetPostsDocument } from '@/entities/post'

import { BanUserDocument } from './documents'

const POSTS_VARIABLES = { pageSize: 12, sortBy: 'createdAt', sortDirection: 'desc' as const }

const buildPost = (id: number, userBan: { reason: string } | null) => ({
  __typename: 'Post' as const,
  id,
  description: `Post ${id}`,
  createdAt: '2023-01-01T00:00:00Z',
  images: [],
  postOwner: {
    __typename: 'PostOwnerModel' as const,
    id: 1,
    userName: 'owner',
    firstName: null,
    lastName: null,
    avatars: [],
  },
  userBan,
})

const buildPostsResult = (userBan: { reason: string } | null) => ({
  data: {
    getPosts: {
      __typename: 'PostsPaginationModel' as const,
      items: [buildPost(1, userBan)],
      pagesCount: 1,
      pageSize: 12,
      totalCount: 1,
    },
  },
})

describe('banUser cache synchronization', () => {
  it('refetches the posts feed after banning a post owner', async () => {
    const getPostsSpy = vi.fn()

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new MockLink([
        {
          request: { query: GetPostsDocument, variables: POSTS_VARIABLES },
          maxUsageCount: 2,
          result: () => {
            getPostsSpy()

            return buildPostsResult(getPostsSpy.mock.calls.length === 1 ? null : { reason: 'Spam' })
          },
        },
        {
          request: { query: BanUserDocument, variables: { banReason: 'Spam', userId: 1 } },
          result: { data: { banUser: true } },
        },
      ]),
    })

    const observable = client.watchQuery({ query: GetPostsDocument, variables: POSTS_VARIABLES })

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
    expect(getPostsSpy).toHaveBeenCalledTimes(1)

    await client.mutate({
      mutation: BanUserDocument,
      variables: { banReason: 'Spam', userId: 1 },
      refetchQueries: ['GetPosts'],
      awaitRefetchQueries: true,
    })

    expect(getPostsSpy).toHaveBeenCalledTimes(2)
    subscription.unsubscribe()
  })
})
