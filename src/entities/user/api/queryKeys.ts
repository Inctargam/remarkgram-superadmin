import type { GetUsersInput } from '@/shared/api/graphql/client'

export const usersQueryKeys = {
  list: (input: GetUsersInput) => ['users', input] as const,
}
