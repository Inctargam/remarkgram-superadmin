import type { GetPaymentsByUserQuery } from '@/shared/api/graphql/__generated__/graphql'

export { GetPaymentsByUserDocument } from './api/documents'
export { usePaymentsByUserQuery } from './api/usePaymentsByUserQuery'
export type { GetPaymentsByUserQueryVariables as GetPaymentsByUserInput } from '@/shared/api/graphql/__generated__/graphql'

export type PaymentPaginationModel = GetPaymentsByUserQuery['getPaymentsByUser']
export type SubscriptionByPaymentModel = PaymentPaginationModel['items'][number]
