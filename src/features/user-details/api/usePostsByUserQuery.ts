'use client'

import { skipToken, useQuery } from '@apollo/client/react'

import type { GetPostsByUserQuery } from '@/shared/api/graphql/__generated__/graphql'

import { GetPostsByUserDocument } from './documents'

export type PostsByUserModel = GetPostsByUserQuery['getPostsByUser']

export const usePostsByUserQuery = (userId: number) => {
  const { data, ...result } = useQuery(
    GetPostsByUserDocument,
    Number.isInteger(userId) && userId > 0
      ? { variables: { userId }, notifyOnNetworkStatusChange: true, ssr: false }
      : skipToken
  )

  return { ...result, data: data?.getPostsByUser }
}
