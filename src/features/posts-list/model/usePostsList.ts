'use client'

import { useEffect, useState } from 'react'

import type { Post, SortDirection } from '@/entities/post'
import { POSTS_PAGE_SIZE, usePostAddedSubscription, usePostsQuery } from '@/entities/post'

export type PostsListState = {
  errorMessage: string | null
  hasMore: boolean
  isInitialLoading: boolean
  isLoadingMore: boolean
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

  const changeSearchValue = (value: string) => {
    setSearchValue(value)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchValue])

  const { data, error, loading, fetchMore } = usePostsQuery({
    pageSize: POSTS_PAGE_SIZE,
    searchTerm: debouncedSearchValue || undefined,
    sortBy: SORT_BY,
    sortDirection: SORT_DIRECTION,
  })

  // A fresh `getPosts` result (first page load or a search change) replaces the
  // walked-so-far list; `fetchMore` pages are appended separately in `loadMore`.
  // Adjusted during render (not in an effect) per https://react.dev/learn/you-might-not-need-an-effect
  const [postsSource, setPostsSource] = useState<typeof data>(undefined)

  if (data !== postsSource) {
    setPostsSource(data)
    setPosts(data?.items ?? [])
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

    fetchMore({
      variables: { endCursorPostId: lastPostId },
    })
      .then((result) => {
        setPosts((current) => dedupeById([...current, ...result.data.getPosts.items]))
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
    posts,
    searchValue,
    changeSearchValue,
    loadMore,
  }
}
