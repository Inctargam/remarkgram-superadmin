'use client'

import { Pagination, Table } from '@remark-gram/ui-kit'
import Link from 'next/link'

import type { Follow, FollowPaginationModel } from '@/entities/follow'
import { formatShortDate } from '@/shared/lib/date'

import styles from './panel.module.css'

const COLUMN_COUNT = 4
const EMPTY_MESSAGE = 'Users not found.'

type Props = {
  data: FollowPaginationModel | undefined
  emptyMessage: string
  isLoading: boolean
  page: number
  pageSize: number
  itemsPerPageOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const fullName = (follow: Follow) =>
  [follow.firstName, follow.lastName].filter(Boolean).join(' ') || follow.userName || ''

export const FollowPanel = ({
  data,
  emptyMessage,
  isLoading,
  page,
  pageSize,
  itemsPerPageOptions,
  onPageChange,
  onPageSizeChange,
}: Props) => {
  const items = data?.items ?? []

  return (
    <div className={styles.panel}>
      <Table.Root aria-busy={isLoading} className={styles.table}>
        <Table.Head className={styles.head}>
          <Table.Row>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Profile link</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Subscription Date</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {isLoading ? <Table.Skeleton columns={COLUMN_COUNT} rows={8} /> : null}

          {!isLoading && items.length === 0 ? (
            <Table.Empty colSpan={COLUMN_COUNT}>{emptyMessage}</Table.Empty>
          ) : null}

          {!isLoading &&
            items.map((follow) => (
              <Table.Row key={follow.id}>
                <Table.Cell>{follow.userId}</Table.Cell>
                <Table.Cell>
                  <Link href={`/users/${follow.userId}`}>{follow.userName}</Link>
                </Table.Cell>
                <Table.Cell>{fullName(follow)}</Table.Cell>
                <Table.Cell>{formatShortDate(follow.createdAt)}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>

      <Pagination
        currentPage={page}
        itemsPerPage={pageSize}
        itemsPerPageOptions={itemsPerPageOptions}
        totalPages={data?.pagesCount ?? 0}
        onItemsPerPageChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
