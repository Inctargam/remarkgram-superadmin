import type { GetUsersInput } from '@/shared/api/graphql/client'

export const usersQueryKeys = {
  root: ['users'] as const,
  list: (input: GetUsersInput) => ['users', input] as const,
  detail: (userId: number) => ['users', 'detail', userId] as const,
}
