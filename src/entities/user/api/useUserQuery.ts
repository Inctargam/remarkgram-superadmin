'use client'

import { skipToken, useQuery } from '@apollo/client/react'

import { GetUserDocument } from './documents'

export const useUserQuery = (userId: number) => {
  const { data, ...result } = useQuery(
    GetUserDocument,
    Number.isInteger(userId) && userId > 0 ? { variables: { userId }, ssr: false } : skipToken
  )

  return { ...result, data: data?.getUser }
}
