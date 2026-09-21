'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { SortDirection, User, UserBlockStatus } from '@/entities/user'
import { USERS_PAGE_SIZE, useUsersQuery } from '@/entities/user'

export type UsersListSortField = 'userName' | 'createdAt'

export type UsersListState = {
  errorMessage: string | null
  isLoading: boolean
  page: number
  pageSize: number
  searchValue: string
  sortBy: UsersListSortField
  sortDirection: SortDirection
  statusFilter: UserBlockStatus
  totalPages: number
  users: User[]
  changePageSize: (pageSize: number) => void
  changeSearchValue: (value: string) => void
  changeStatusFilter: (value: UserBlockStatus) => void
  goToPage: (page: number) => void
  toggleSortBy: (field: UsersListSortField) => void
}

type UsersListFiltersSnapshot = {
  term: string
  statusFilter: UserBlockStatus
  sortBy: UsersListSortField
  sortDirection: SortDirection
}

const FIRST_PAGE = 1
const SEARCH_DEBOUNCE_MS = 300
const LOAD_ERROR_MESSAGE = 'Failed to load users. Please try again.'

const parsePageParam = (value: string | null | undefined): number => {
  const page = Number(value)

  if (!Number.isInteger(page) || page < FIRST_PAGE) {
    return FIRST_PAGE
  }

  return page
}

const buildUsersPageQuery = (page: number): string => (page === FIRST_PAGE ? '' : `?page=${page}`)

/**
 * The page is read from and written to the url; search, filter, sort and page size
 * are view preferences, so they stay in state.
 */
export const useUsersList = (): UsersListState => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [pageSize, setPageSize] = useState(USERS_PAGE_SIZE)
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const [sortBy, setSortBy] = useState<UsersListSortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<UserBlockStatus>('ALL')

  const page = parsePageParam(searchParams?.get('page'))

  const goToPage = useCallback(
    (nextPage: number) => {
      const currentPath = pathname ?? window.location.pathname
      const query = buildUsersPageQuery(nextPage)

      // `replace`, not `push`: paging is not a step the back button should have to undo.
      router.replace(query ? `${currentPath}?${query}` : currentPath, { scroll: false })
    },
    [pathname, router]
  )

  const changePageSize = useCallback(
    (nextPageSize: number) => {
      setPageSize(nextPageSize)
      // A longer page makes the old page number point somewhere else, or nowhere at all.
      goToPage(FIRST_PAGE)
    },
    [goToPage]
  )

  const changeSearchValue = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const changeStatusFilter = useCallback((value: UserBlockStatus) => {
    setStatusFilter(value)
  }, [])

  const toggleSortBy = useCallback((field: UsersListSortField) => {
    setSortBy((currentSortBy) => {
      if (currentSortBy === field) {
        setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortDirection('asc')
      }

      return field
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchValue])

  const { data, error, loading, previousData } = useUsersQuery({
    pageNumber: page,
    pageSize,
    searchTerm: debouncedSearchValue || undefined,
    sortBy,
    sortDirection,
    statusFilter,
  })

  // Apollo keeps the last result in `previousData` while the next page loads,
  // which mirrors TanStack's `keepPreviousData` behavior.
  const result = data ?? previousData

  // Search, filter and sort changes restart the walk from the first page. The page
  // parameter itself is deliberately absent: paging must not reset the page.
  const filtersSnapshotRef = useRef<UsersListFiltersSnapshot>({
    term: '',
    statusFilter: 'ALL',
    sortBy: 'createdAt',
    sortDirection: 'desc',
  })

  useEffect(() => {
    const snapshot = filtersSnapshotRef.current
    const isChanged =
      snapshot.term !== debouncedSearchValue ||
      snapshot.statusFilter !== statusFilter ||
      snapshot.sortBy !== sortBy ||
      snapshot.sortDirection !== sortDirection

    if (!isChanged) {
      return
    }

    filtersSnapshotRef.current = { term: debouncedSearchValue, statusFilter, sortBy, sortDirection }
    goToPage(FIRST_PAGE)
  }, [debouncedSearchValue, goToPage, sortBy, sortDirection, statusFilter])

  return {
    errorMessage: error ? LOAD_ERROR_MESSAGE : null,
    isLoading: loading && !result,
    page,
    pageSize,
    searchValue,
    sortBy,
    sortDirection,
    statusFilter,
    totalPages: result?.pagination.pagesCount ?? 0,
    users: result?.users ?? [],
    changePageSize,
    changeSearchValue,
    changeStatusFilter,
    goToPage,
    toggleSortBy,
  }
}
