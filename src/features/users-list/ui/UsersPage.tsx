'use client'

import { Alert, Pagination } from '@remark-gram/ui-kit'

import { useUsersList } from '../model/useUsersList'
import styles from './usersPage.module.css'
import { UsersTable } from './UsersTable'
import { UsersToolbar } from './UsersToolbar'

const ITEMS_PER_PAGE_OPTIONS = [8, 16, 32, 64]

export const UsersPage = () => {
  const {
    users,
    totalPages,
    page,
    pageSize,
    isLoading,
    errorMessage,
    searchValue,
    statusFilter,
    sortBy,
    sortDirection,
    changePageSize,
    changeSearchValue,
    changeStatusFilter,
    goToPage,
    toggleSortBy,
  } = useUsersList()

  return (
    <div className={styles.page}>
      {errorMessage ? (
        <Alert variant="error">{errorMessage}</Alert>
      ) : (
        <>
          <UsersToolbar
            searchValue={searchValue}
            statusFilter={statusFilter}
            onSearchChange={changeSearchValue}
            onStatusFilterChange={changeStatusFilter}
          />
          <UsersTable
            isLoading={isLoading}
            sortBy={sortBy}
            sortDirection={sortDirection}
            users={users}
            onToggleSort={toggleSortBy}
          />
          <Pagination
            currentPage={page}
            itemsPerPage={pageSize}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            totalPages={totalPages}
            onItemsPerPageChange={changePageSize}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  )
}
