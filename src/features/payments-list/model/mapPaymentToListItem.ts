import type { GetPaymentsQuery } from '@/shared/api/graphql/__generated__/graphql'

import type { PaymentListItem } from './types'

type Payment = GetPaymentsQuery['getPayments']['items'][number]

const SUBSCRIPTION_LABELS = {
  DAY: '1 day',
  WEEKLY: '7 days',
  MONTHLY: '1 month',
} as const

const PAYMENT_METHOD_LABELS = {
  STRIPE: 'Stipe',
  PAYPAL: 'PayPal',
  CREDIT_CARD: 'Credit card',
} as const

export const mapPaymentToListItem = (
  payment: Payment,
  index: number,
  page: number,
  pageSize: number
): PaymentListItem => ({
  id: payment.id ?? -((page - 1) * pageSize + index + 1),
  userName: payment.userName,
  avatar: payment.avatars?.find((avatar) => avatar.url)?.url ?? null,
  createdAt: payment.createdAt ?? '',
  amount: payment.amount,
  currency: payment.currency,
  subscription: SUBSCRIPTION_LABELS[payment.type],
  paymentMethod: PAYMENT_METHOD_LABELS[payment.paymentMethod],
})
