// @vitest-environment jsdom
import { ApolloLink } from '@apollo/client'
import { MockLink, MockSubscriptionLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { OperationTypeNode } from 'graphql'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { GetPostsDocument } from '@/entities/post'

import { usePostsList } from './usePostsList'

const POSTS_VARIABLES = {
  pageSize: 12,
  searchTerm: undefined,
  sortBy: 'createdAt',
  sortDirection: 'desc' as const,
}

const buildPost = (id: number) => ({
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
  userBan: null,
})

const buildPostsResult = (ids: number[], totalCount: number) => ({
  data: {
    getPosts: {
      __typename: 'PostsPaginationModel' as const,
      items: ids.map(buildPost),
      pagesCount: Math.ceil(totalCount / 12),
      pageSize: 12,
      totalCount,
    },
  },
})

const renderPostsList = (mockLink: MockLink, subscriptionLink: MockSubscriptionLink) => {
  const link = ApolloLink.split(
    (operation) =>
      operation.query.definitions.some(
        (definition) =>
          definition.kind === 'OperationDefinition' &&
          definition.operation === OperationTypeNode.SUBSCRIPTION
      ),
    subscriptionLink,
    mockLink
  )

  const wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider link={link}>{children}</MockedProvider>
  )

  return renderHook(() => usePostsList(), { wrapper })
}

describe('usePostsList', () => {
  it('loads the first page and appends the next page via fetchMore', async () => {
    const mockLink = new MockLink([
      {
        request: { query: GetPostsDocument, variables: POSTS_VARIABLES },
        result: buildPostsResult([1, 2, 3], 5),
      },
      {
        request: {
          query: GetPostsDocument,
          variables: { ...POSTS_VARIABLES, endCursorPostId: 3 },
        },
        result: buildPostsResult([4, 5], 5),
      },
    ])

    const { result } = renderPostsList(mockLink, new MockSubscriptionLink())

    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))
    expect(result.current.posts.map((post) => post.id)).toEqual([1, 2, 3])
    expect(result.current.hasMore).toBe(true)

    await act(async () => {
      result.current.loadMore()
    })

    await waitFor(() =>
      expect(result.current.posts.map((post) => post.id)).toEqual([1, 2, 3, 4, 5])
    )
    expect(result.current.hasMore).toBe(false)
  })

  it('merges a subscription-published post to the front, deduped by id', async () => {
    const mockLink = new MockLink([
      {
        request: { query: GetPostsDocument, variables: POSTS_VARIABLES },
        result: buildPostsResult([1, 2], 2),
      },
    ])
    const subscriptionLink = new MockSubscriptionLink()

    const { result } = renderPostsList(mockLink, subscriptionLink)

    await waitFor(() => expect(result.current.isInitialLoading).toBe(false))
    expect(result.current.posts.map((post) => post.id)).toEqual([1, 2])

    act(() => {
      subscriptionLink.simulateResult({ result: { data: { postAdded: buildPost(99) } } })
    })

    await waitFor(() => expect(result.current.posts.map((post) => post.id)).toEqual([99, 1, 2]))

    // A repeat announcement of the same post (e.g. a duplicate publish) must not duplicate it.
    act(() => {
      subscriptionLink.simulateResult({ result: { data: { postAdded: buildPost(99) } } })
    })

    await waitFor(() => expect(result.current.posts.map((post) => post.id)).toEqual([99, 1, 2]))
  })
})
