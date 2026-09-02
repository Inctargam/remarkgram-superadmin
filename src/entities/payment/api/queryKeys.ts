import type { GetPaymentsByUserInput } from '@/shared/api/graphql/client'

export const paymentsQueryKeys = {
  byUser: (input: GetPaymentsByUserInput) => ['payments', 'byUser', input] as const,
}
