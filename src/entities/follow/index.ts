import type { GetFollowersQuery } from '@/shared/api/graphql/__generated__/graphql'

export { GetFollowersDocument, GetFollowingDocument } from './api/documents'
export { useFollowersQuery, useFollowingQuery } from './api/useFollowListQuery'
export type { GetFollowersQueryVariables as FollowListInput } from '@/shared/api/graphql/__generated__/graphql'

export type FollowPaginationModel = GetFollowersQuery['getFollowers']
export type Follow = FollowPaginationModel['items'][number]
