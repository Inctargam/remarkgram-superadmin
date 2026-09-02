'use client'

import { Alert, Pagination } from '@remark-gram/ui-kit'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { User } from '@/entities/user'

import { useUsersList } from '../model/useUsersList'
import { DeleteUserDialog } from './DeleteUserDialog'
import styles from './usersPage.module.css'
import { UsersTable } from './UsersTable'
import { UsersToolbar } from './UsersToolbar'

const ITEMS_PER_PAGE_OPTIONS = [8, 16, 32, 64]

export const UsersPage = () => {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
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

  const closeDeleteDialog = (open: boolean) => {
    if (!open) {
      setDeleteTarget(null)
    }
  }

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
            onDeleteClick={setDeleteTarget}
            onMoreInfoClick={(user) => router.push(`/users/${user.id}`)}
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

      {deleteTarget ? (
        <DeleteUserDialog
          open={Boolean(deleteTarget)}
          user={deleteTarget}
          onOpenChange={closeDeleteDialog}
        />
      ) : null}
    </div>
  )
}
