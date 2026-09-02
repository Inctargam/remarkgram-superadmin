import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createSchema } from 'graphql-yoga'

export const ADMIN_EMAIL = 'admin@gmail.com'
export const ADMIN_PASSWORD = 'admin'

const typeDefs = readFileSync(join(process.cwd(), 'src/shared/api/graphql/schema.graphql'), 'utf-8')

type MockProfile = {
  id: number
  userName: string
  firstName: string
  lastName: string
  createdAt: string
}

type MockUser = {
  id: number
  userName: string
  email: string
  createdAt: string
  profile: MockProfile
  userBan?: { reason: string; createdAt: string }
}

const DESIGN_USERS = [
  { userName: 'Ivan.sr.yakimenko', firstName: 'Ivan', lastName: 'Yakymenko' },
  { userName: 'Kirill_Mikulich', firstName: 'Kirill', lastName: 'Mikulich' },
  { userName: 'Anton.Antonov', firstName: 'Anton', lastName: 'Antonov' },
  { userName: 'OlegOlegovich', firstName: 'Oleg', lastName: 'Olegovich' },
  { userName: 'Anna_Votakaya', firstName: 'Anna', lastName: 'Votakaya' },
  { userName: 'Nikilay89Kolya', firstName: 'Nikilay', lastName: 'Kolya' },
  { userName: 'Artur_Perojcov', firstName: 'Artur', lastName: 'Perojcov' },
  { userName: 'Ekaterina-Mastereo', firstName: 'Ekaterina', lastName: 'Mastereo' },
] as const

const DESIGN_CREATED_ATS = [
  '2022-12-12T23:59:00Z',
  '2022-12-12T22:30:00Z',
  '2022-12-12T21:00:00Z',
  '2022-12-12T19:45:00Z',
  '2022-12-12T18:20:00Z',
  '2022-12-12T15:10:00Z',
  '2022-12-12T13:05:00Z',
  '2022-12-12T10:00:00Z',
] as const

const BLOCKED_USER_IDS = new Set([1, 4, 7, 17, 43, 71])

const buildMockUser = (
  id: number,
  {
    userName,
    firstName,
    lastName,
  }: (typeof DESIGN_USERS)[number] | { userName: string; firstName: string; lastName: string },
  createdAt: string
): MockUser => ({
  id,
  userName,
  email: `${userName.toLowerCase()}@example.com`,
  createdAt,
  profile: { id, userName, firstName, lastName, createdAt },
  userBan: BLOCKED_USER_IDS.has(id) ? { reason: 'Spam', createdAt } : undefined,
})

const GENERATED_USERS: MockUser[] = Array.from({ length: 72 }, (_, index) => {
  const id = index + 9
  const createdAt = new Date(Date.UTC(2022, 8, 1 - index, 12, 0, 0)).toISOString()

  return buildMockUser(
    id,
    { userName: `user-${id}`, firstName: 'User', lastName: `${id}` },
    createdAt
  )
})

const buildMockUsers = (): MockUser[] => [
  ...DESIGN_USERS.map((designUser, index) =>
    buildMockUser(index + 1, designUser, DESIGN_CREATED_ATS[index])
  ),
  ...GENERATED_USERS,
]

const MOCK_USERS: MockUser[] = buildMockUsers()

/** Restores the seed after mutating operations — for tests and dev reloads. */
export const resetMockUsers = () => {
  MOCK_USERS.length = 0
  MOCK_USERS.push(...buildMockUsers())
}

const removeUser = (_: unknown, { userId }: { userId: number }) => {
  const index = MOCK_USERS.findIndex((user) => user.id === userId)

  if (index === -1) {
    return false
  }

  MOCK_USERS.splice(index, 1)

  return true
}

type GetUsersArgs = {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: string | null
  sortDirection?: string | null
  searchTerm?: string | null
  statusFilter?: string | null
}

const getUsers = (_: unknown, args: GetUsersArgs) => {
  const pageNumber = args.pageNumber ?? 1
  const pageSize = args.pageSize ?? 10
  const sortBy = args.sortBy ?? 'createdAt'
  const sortDirection = args.sortDirection ?? 'desc'
  const searchTerm = args.searchTerm ?? ''
  const statusFilter = args.statusFilter ?? 'ALL'

  let users: MockUser[] = [...MOCK_USERS]

  if (searchTerm) {
    const term = searchTerm.toLowerCase()

    users = users.filter((user) => user.userName.toLowerCase().includes(term))
  }

  if (statusFilter === 'BLOCKED') {
    users = users.filter((user) => user.userBan)
  }

  if (statusFilter === 'UNBLOCKED') {
    users = users.filter((user) => !user.userBan)
  }

  users.sort((a, b) => {
    const field = sortBy === 'userName' ? 'userName' : 'createdAt'
    const aValue = a[field]
    const bValue = b[field]
    const direction = sortDirection === 'asc' ? 1 : -1

    return aValue.localeCompare(bValue) * direction
  })

  const totalCount = users.length
  const pagesCount = Math.ceil(totalCount / pageSize)

  return {
    users: users.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    pagination: {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
    },
  }
}

export const createServerSchema = () =>
  createSchema({
    typeDefs,
    resolvers: {
      Mutation: {
        loginAdmin: (_: unknown, { email, password }: { email: string; password: string }) => ({
          logged: email === ADMIN_EMAIL && password === ADMIN_PASSWORD,
        }),
        removeUser,
      },
      Query: {
        getUsers,
      },
    },
  })
