'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { GetUsersInput, UsersPaginationModel } from '@/shared/api/graphql/client'
import { getUsers } from '@/shared/api/graphql/client'

import { usersQueryKeys } from './queryKeys'

export const USERS_PAGE_SIZE = 8

export const useUsersQuery = (input: GetUsersInput) =>
  useQuery<UsersPaginationModel>({
    queryKey: usersQueryKeys.list(input),
    queryFn: () => getUsers(input),
    placeholderData: keepPreviousData,
  })
