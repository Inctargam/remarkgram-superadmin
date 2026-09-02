'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getPostsByUser } from '@/shared/api/graphql/client'

export const usePostsByUserQuery = (userId: number) =>
  useQuery({
    queryKey: ['posts', 'byUser', userId],
    queryFn: () => getPostsByUser(userId),
    placeholderData: keepPreviousData,
    enabled: Number.isInteger(userId) && userId > 0,
  })
