'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { User } from '@/shared/api/graphql/client'
import { getUser } from '@/shared/api/graphql/client'

import { usersQueryKeys } from './queryKeys'

export const useUserQuery = (userId: number) =>
  useQuery<User>({
    queryKey: usersQueryKeys.detail(userId),
    queryFn: () => getUser(userId),
    placeholderData: keepPreviousData,
    enabled: Number.isInteger(userId) && userId > 0,
  })
