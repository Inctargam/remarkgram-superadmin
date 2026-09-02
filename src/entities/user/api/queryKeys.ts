import type { GetUsersInput } from '@/shared/api/graphql/client'

export const usersQueryKeys = {
  root: ['users'] as const,
  list: (input: GetUsersInput) => ['users', input] as const,
}
