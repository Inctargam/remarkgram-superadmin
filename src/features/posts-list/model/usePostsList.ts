'use client'

import { useEffect, useRef, useState } from 'react'

import type { Post, SortDirection } from '@/entities/post'
import { POSTS_PAGE_SIZE, usePostAddedSubscription, usePostsQuery } from '@/entities/post'

export type PostsListState = {
  errorMessage: string | null
  hasMore: boolean
  isInitialLoading: boolean
  isLoadingMore: boolean
  loadMoreErrorMessage: string | null
  posts: Post[]
  searchValue: string
  changeSearchValue: (value: string) => void
  loadMore: () => void
}

const SEARCH_DEBOUNCE_MS = 300
const LOAD_ERROR_MESSAGE = 'Failed to load posts. Please try again.'
const SORT_BY = 'createdAt'
const SORT_DIRECTION: SortDirection = 'desc'

const dedupeById = (posts: Post[]): Post[] => {
  const seen = new Set<number>()

  return posts.filter((post) => (seen.has(post.id) ? false : seen.add(post.id)))
}

export const usePostsList = (): PostsListState => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreErrorMessage, setLoadMoreErrorMessage] = useState<string | null>(null)

  const changeSearchValue = (value: string) => {
    setSearchValue(value)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchValue])

  // Tracks the search term the current `posts` list was built for, and lets `loadMore`
  // detect a stale in-flight request after the search term has since changed.
  const debouncedSearchValueRef = useRef(debouncedSearchValue)

  useEffect(() => {
    debouncedSearchValueRef.current = debouncedSearchValue
  }, [debouncedSearchValue])

  const { data, error, loading, fetchMore } = usePostsQuery({
    pageSize: POSTS_PAGE_SIZE,
    searchTerm: debouncedSearchValue || undefined,
    sortBy: SORT_BY,
    sortDirection: SORT_DIRECTION,
  })

  // A fresh `getPosts` result triggers this whenever the base query's `data` changes —
  // that includes a real search change, but also a same-variables refetch (e.g.
  // `refetchQueries: ['GetPosts']` after banning an owner). Only a search change should
  // discard the pages walked so far via `loadMore`; any other refetch instead merges the
  // refreshed page-1 items into the existing list so scrolled-in pages survive.
  // Adjusted during render (not in an effect) per https://react.dev/learn/you-might-not-need-an-effect
  const [postsSource, setPostsSource] = useState<typeof data>(undefined)
  const [appliedSearchValue, setAppliedSearchValue] = useState(debouncedSearchValue)

  if (data !== postsSource) {
    const isFreshSearch = appliedSearchValue !== debouncedSearchValue
    const freshItems = data?.items ?? []

    setPostsSource(data)
    setAppliedSearchValue(debouncedSearchValue)

    if (isFreshSearch) {
      setPosts(freshItems)
    } else {
      const freshIds = new Set(freshItems.map((post) => post.id))

      setPosts(dedupeById([...freshItems, ...posts.filter((post) => !freshIds.has(post.id))]))
    }
  }

  const onPostAdded = (post: Post) => {
    // New posts always land on top of the feed, regardless of the current sort —
    // the subscription only ever announces "just published", not a re-sort signal.
    setPosts((current) => dedupeById([post, ...current]))
  }

  usePostAddedSubscription({ onPostAdded })

  const totalCount = data?.totalCount ?? 0
  const hasMore = posts.length < totalCount
  const lastPostId = posts.at(-1)?.id

  const loadMore = () => {
    if (lastPostId === undefined || isLoadingMore) {
      return
    }

    setIsLoadingMore(true)
    setLoadMoreErrorMessage(null)

    const requestedForSearchValue = debouncedSearchValueRef.current

    fetchMore({
      variables: { endCursorPostId: lastPostId },
    })
      .then((result) => {
        // The search term changed while this request was in flight — its cursor no
        // longer applies to the now-current list, so drop the response instead of
        // appending stale-search results onto it.
        if (debouncedSearchValueRef.current !== requestedForSearchValue) {
          return
        }

        setPosts((current) => dedupeById([...current, ...result.data.getPosts.items]))
      })
      .catch(() => {
        setLoadMoreErrorMessage(LOAD_ERROR_MESSAGE)
      })
      .finally(() => {
        setIsLoadingMore(false)
      })
  }

  return {
    errorMessage: error ? LOAD_ERROR_MESSAGE : null,
    hasMore,
    isInitialLoading: loading && posts.length === 0,
    isLoadingMore,
    loadMoreErrorMessage,
    posts,
    searchValue,
    changeSearchValue,
    loadMore,
  }
}
