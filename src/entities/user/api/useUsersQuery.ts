'use client'

import { useQuery } from '@apollo/client/react'

import type { GetUsersQueryVariables } from '@/shared/api/graphql/__generated__/graphql'

import { GetUsersDocument } from './documents'

export const USERS_PAGE_SIZE = 8

export const useUsersQuery = (input: GetUsersQueryVariables) => {
  const { data, previousData, ...result } = useQuery(GetUsersDocument, {
    variables: input,
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  return {
    ...result,
    data: data?.getUsers,
    previousData: previousData?.getUsers,
  }
}
