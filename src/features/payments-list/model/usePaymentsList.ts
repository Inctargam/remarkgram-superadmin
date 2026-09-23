'use client'

import { useEffect, useState } from 'react'

import { usePaymentsQuery } from '../api/usePaymentsQuery'
import { mapPaymentToListItem } from './mapPaymentToListItem'
import type { PaymentListSortDirection, PaymentListSortField } from './types'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
const SEARCH_DEBOUNCE_MS = 300
const LOAD_ERROR_MESSAGE = 'Failed to load payments. Please try again.'

export const usePaymentsList = () => {
  const [searchValue, setSearchValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<PaymentListSortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<PaymentListSortDirection>('desc')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchValue.trim()), SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchValue])

  const { data, error, loading } = usePaymentsQuery(
    {
      pageNumber: page,
      pageSize,
      searchTerm: searchTerm || undefined,
      sortBy,
      sortDirection,
    },
    autoUpdate
  )

  const items =
    data?.items.map((payment, index) => mapPaymentToListItem(payment, index, page, pageSize)) ?? []

  const changeSearchValue = (value: string) => {
    setSearchValue(value)
    setPage(1)
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
    isLoading: loading && !data,
    items,
    page,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pagesCount: data?.pagesCount ?? 0,
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
