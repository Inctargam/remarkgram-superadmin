'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { GetPaymentsByUserInput, PaymentPaginationModel } from '@/shared/api/graphql/client'
import { getPaymentsByUser } from '@/shared/api/graphql/client'

import { paymentsQueryKeys } from './queryKeys'

export const usePaymentsByUserQuery = (input: GetPaymentsByUserInput) =>
  useQuery<PaymentPaginationModel>({
    queryKey: paymentsQueryKeys.byUser(input),
    queryFn: () => getPaymentsByUser(input),
    placeholderData: keepPreviousData,
  })
