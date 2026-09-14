'use client'

import { Pagination, Table } from '@remark-gram/ui-kit'

import type { PaymentPaginationModel } from '@/entities/payment'
import { formatShortDate } from '@/shared/lib/date'

import styles from './panel.module.css'

const COLUMN_COUNT = 5
const EMPTY_MESSAGE = 'Payments not found.'

const SUBSCRIPTION_TYPE_LABELS = {
  MONTHLY: '30 days',
  DAY: '1 day',
  WEEKLY: '7 day',
} as const

const PAYMENT_TYPE_LABELS = {
  STRIPE: 'Stripe',
  PAYPAL: 'PayPal',
  CREDIT_CARD: 'Credit card',
} as const

type Props = {
  data: PaymentPaginationModel | undefined
  isLoading: boolean
  page: number
  pageSize: number
  itemsPerPageOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export const PaymentsPanel = ({
  data,
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
            <Table.HeadCell>Date of Payment</Table.HeadCell>
            <Table.HeadCell>End date of subscription</Table.HeadCell>
            <Table.HeadCell>Amount, $</Table.HeadCell>
            <Table.HeadCell>Subscription Type</Table.HeadCell>
            <Table.HeadCell>Payment Type</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {isLoading ? <Table.Skeleton columns={COLUMN_COUNT} rows={8} /> : null}

          {!isLoading && items.length === 0 ? (
            <Table.Empty colSpan={COLUMN_COUNT}>{EMPTY_MESSAGE}</Table.Empty>
          ) : null}

          {!isLoading &&
            items.map((payment) => (
              <Table.Row key={payment.id}>
                <Table.Cell>{formatShortDate(payment.dateOfPayment ?? '')}</Table.Cell>
                <Table.Cell>{formatShortDate(payment.endDate ?? '')}</Table.Cell>
                <Table.Cell>{payment.price !== null ? `$${payment.price}` : ''}</Table.Cell>
                <Table.Cell>
                  {payment.type ? SUBSCRIPTION_TYPE_LABELS[payment.type] : ''}
                </Table.Cell>
                <Table.Cell>
                  {payment.paymentType ? PAYMENT_TYPE_LABELS[payment.paymentType] : ''}
                </Table.Cell>
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
