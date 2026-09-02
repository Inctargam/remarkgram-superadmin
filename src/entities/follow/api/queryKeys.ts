import type { FollowListInput } from '@/shared/api/graphql/client'

export const followQueryKeys = {
  list: (kind: string, input: FollowListInput) => ['follow', kind, input] as const,
}
