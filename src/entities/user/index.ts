import type { GetUserQuery, GetUsersQuery } from '@/shared/api/graphql/__generated__/graphql'

export { GetUserDocument, GetUsersDocument } from './api/documents'
export { useUserQuery } from './api/useUserQuery'
export { USERS_PAGE_SIZE, useUsersQuery } from './api/useUsersQuery'
export type {
  GetUsersQueryVariables as GetUsersInput,
  SortDirection,
  UserBlockStatus,
} from '@/shared/api/graphql/__generated__/graphql'

export type UsersPaginationModel = GetUsersQuery['getUsers']
export type User = UsersPaginationModel['users'][number]
export type UserBan = NonNullable<User['userBan']>
export type UserDetails = GetUserQuery['getUser']
