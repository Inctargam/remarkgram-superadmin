'use client'

import { Alert, Pagination } from '@remark-gram/ui-kit'

import { usePaymentsList } from '../model/usePaymentsList'
import styles from './paymentsList.module.css'
import { PaymentsTable } from './PaymentsTable'
import { PaymentsToolbar } from './PaymentsToolbar'

export const PaymentsList = () => {
  const list = usePaymentsList()

  return (
    <div className={styles.page}>
      <PaymentsToolbar
        autoUpdate={list.autoUpdate}
        searchValue={list.searchValue}
        onAutoUpdateChange={list.setAutoUpdate}
        onSearchChange={list.changeSearchValue}
      />

      {list.errorMessage ? <Alert variant="error">{list.errorMessage}</Alert> : null}

      {!list.errorMessage ? (
        <>
          <PaymentsTable
            isLoading={list.isLoading}
            items={list.items}
            sortBy={list.sortBy}
            sortDirection={list.sortDirection}
            onToggleSort={list.toggleSortBy}
          />

          <Pagination
            className={styles.pagination}
            currentPage={list.page}
            itemsPerPage={list.pageSize}
            itemsPerPageOptions={list.pageSizeOptions}
            totalPages={list.pagesCount}
            onItemsPerPageChange={list.changePageSize}
            onPageChange={list.setPage}
          />
        </>
      ) : null}
    </div>
  )
}
