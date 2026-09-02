'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { FollowListInput, FollowPaginationModel } from '@/shared/api/graphql/client'
import { getFollowers, getFollowing } from '@/shared/api/graphql/client'

import { followQueryKeys } from './queryKeys'

export type FollowListKind = 'followers' | 'following'

export const useFollowListQuery = (kind: FollowListKind, input: FollowListInput) => {
  const isFollowers = kind === 'followers'

  return useQuery<FollowPaginationModel>({
    queryKey: followQueryKeys.list(kind, input),
    queryFn: () => (isFollowers ? getFollowers(input) : getFollowing(input)),
    placeholderData: keepPreviousData,
  })
}
