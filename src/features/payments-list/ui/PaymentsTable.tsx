'use client'

import { ArrowIosDownOutlineIcon, ArrowIosUpIcon, Table } from '@remark-gram/ui-kit'
import Image from 'next/image'

import { formatShortDate } from '@/shared/lib/date'

import type {
  PaymentListItem,
  PaymentListSortDirection,
  PaymentListSortField,
} from '../model/types'
import styles from './paymentsTable.module.css'

type Props = {
  isLoading: boolean
  items: PaymentListItem[]
  sortBy: PaymentListSortField
  sortDirection: PaymentListSortDirection
  onToggleSort: (field: PaymentListSortField) => void
}

const SortArrows = ({
  active,
  direction,
}: {
  active: boolean
  direction: PaymentListSortDirection
}) => (
  <span className={styles.sortArrows} aria-hidden="true">
    <ArrowIosUpIcon
      className={active && direction === 'asc' ? styles.sortArrowActive : undefined}
      size={12}
    />
    <ArrowIosDownOutlineIcon
      className={active && direction === 'desc' ? styles.sortArrowActive : undefined}
      size={12}
    />
  </span>
)

export const PaymentsTable = ({ isLoading, items, sortBy, sortDirection, onToggleSort }: Props) => {
  const sortHeader = (label: string, field: PaymentListSortField) => (
    <button className={styles.sortButton} type="button" onClick={() => onToggleSort(field)}>
      {label}
      <SortArrows active={sortBy === field} direction={sortDirection} />
    </button>
  )

  return (
    <Table.Root
      className={styles.table}
      wrapperClassName={styles.tableWrapper}
      aria-busy={isLoading}>
      <colgroup>
        <col className={styles.nameColumn} />
        <col className={styles.dateColumn} />
        <col className={styles.amountColumn} />
        <col className={styles.subscriptionColumn} />
        <col className={styles.methodColumn} />
      </colgroup>
      <Table.Head className={styles.head}>
        <Table.Row>
          <Table.HeadCell>{sortHeader('Username', 'userName')}</Table.HeadCell>
          <Table.HeadCell>{sortHeader('Date added', 'createdAt')}</Table.HeadCell>
          <Table.HeadCell>{sortHeader('Amount, $', 'amount')}</Table.HeadCell>
          <Table.HeadCell>Subscription</Table.HeadCell>
          <Table.HeadCell>{sortHeader('Payment Method', 'paymentMethod')}</Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {isLoading ? <Table.Skeleton columns={5} rows={6} /> : null}
        {!isLoading && items.length > 0 ? (
          items.map((payment) => (
            <Table.Row key={payment.id} className={styles.row}>
              <Table.Cell>
                <div className={styles.user}>
                  {payment.avatar ? (
                    <Image
                      alt=""
                      className={styles.avatar}
                      height={36}
                      src={payment.avatar}
                      width={36}
                    />
                  ) : (
                    <span className={styles.avatarFallback} aria-hidden="true" />
                  )}
                  <span className={styles.userName} title={payment.userName}>
                    {payment.userName}
                  </span>
                </div>
              </Table.Cell>
              <Table.Cell>{formatShortDate(payment.createdAt)}</Table.Cell>
              <Table.Cell>
                {payment.amount === null
                  ? '—'
                  : `${payment.amount}${payment.currency === 'EUR' ? '€' : '$'}`}
              </Table.Cell>
              <Table.Cell>{payment.subscription}</Table.Cell>
              <Table.Cell>{payment.paymentMethod}</Table.Cell>
            </Table.Row>
          ))
        ) : !isLoading ? (
          <Table.Empty colSpan={5}>Payments not found.</Table.Empty>
        ) : null}
      </Table.Body>
    </Table.Root>
  )
}
