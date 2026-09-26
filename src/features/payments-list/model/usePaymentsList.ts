'use client'

import { useEffect, useState } from 'react'

import { usePaymentsQuery } from '../api/usePaymentsQuery'
import { mapPaymentToListItem } from './mapPaymentToListItem'
import type { PaymentListSortDirection, PaymentListSortField } from './types'

const PAGE_SIZE_OPTIONS = [6, 12, 18, 36, 72, 100]
const SEARCH_DEBOUNCE_MS = 300

// TODO: Replace the generic message when the backend error contract is defined.
const LOAD_ERROR_MESSAGE = 'Failed to load payments. Please try again.'

export const usePaymentsList = () => {
  const [searchValue, setSearchValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<PaymentListSortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<PaymentListSortDirection>('desc')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  useEffect(() => {
    const nextSearchTerm = searchValue.trim()
    if (nextSearchTerm === searchTerm) return

    const timer = setTimeout(() => {
      setSearchTerm(nextSearchTerm)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchValue, searchTerm])

  const { data, error, loading, previousData } = usePaymentsQuery(
    {
      pageNumber: page,
      pageSize,
      searchTerm: searchTerm || undefined,
      sortBy,
      sortDirection,
    },
    autoUpdate
  )

  const result = data ?? previousData
  const items =
    result?.items.map((payment, index) => mapPaymentToListItem(payment, index, page, pageSize)) ??
    []

  const changeSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const toggleSortBy = (field: PaymentListSortField) => {
    if (field === sortBy) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
    setPage(1)
  }

  const changePageSize = (value: number) => {
    setPageSize(value)
    setPage(1)
  }

  return {
    autoUpdate,
    errorMessage: error ? LOAD_ERROR_MESSAGE : null,
    hasData: Boolean(result),
    isLoading: loading && !result,
    items,
    page,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pagesCount: result?.pagesCount ?? 0,
    searchValue,
    sortBy,
    sortDirection,
    changePageSize,
    changeSearchValue,
    setAutoUpdate,
    setPage,
    toggleSortBy,
  }
}
