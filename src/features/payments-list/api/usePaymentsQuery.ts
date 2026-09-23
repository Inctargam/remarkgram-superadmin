'use client'

import { useQuery } from '@apollo/client/react'

import type { GetPaymentsQueryVariables } from '@/shared/api/graphql/__generated__/graphql'

import { GetPaymentsDocument } from './documents'

const AUTO_UPDATE_INTERVAL_MS = 30_000

export const usePaymentsQuery = (variables: GetPaymentsQueryVariables, autoUpdate: boolean) => {
  const { data, ...result } = useQuery(GetPaymentsDocument, {
    variables,
    pollInterval: autoUpdate ? AUTO_UPDATE_INTERVAL_MS : 0,
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  return { ...result, data: data?.getPayments }
}
