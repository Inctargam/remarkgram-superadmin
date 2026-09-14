'use client'

import { useQuery } from '@apollo/client/react'

import type { GetPaymentsByUserQueryVariables } from '@/shared/api/graphql/__generated__/graphql'

import { GetPaymentsByUserDocument } from './documents'

export const usePaymentsByUserQuery = (input: GetPaymentsByUserQueryVariables) => {
  const { data, ...result } = useQuery(GetPaymentsByUserDocument, {
    variables: input,
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  return { ...result, data: data?.getPaymentsByUser }
}
