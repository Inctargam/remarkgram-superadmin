import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { GraphQLError } from 'graphql'
import { createPubSub, createSchema } from 'graphql-yoga'

export const ADMIN_EMAIL = 'admin@gmail.com'
export const ADMIN_PASSWORD = 'admin'

const typeDefs = readFileSync(join(process.cwd(), 'src/shared/api/graphql/schema.graphql'), 'utf-8')

type MockProfile = {
  id: number
  userName: string
  firstName: string
  lastName: string
  createdAt: string
  avatars?: Array<{ url: string; width: number; height: number }>
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
  profile: {
    id,
    userName,
    firstName,
    lastName,
    createdAt,
    avatars: [{ url: `https://i.pravatar.cc/150?img=${(id % 70) + 1}`, width: 96, height: 96 }],
  },
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

const banUser = (_: unknown, { banReason, userId }: { banReason: string; userId: number }) => {
  const user = MOCK_USERS.find((candidate) => candidate.id === userId)

  if (!user) {
    throw new GraphQLError(`User not found. Id: ${userId}`)
  }

  user.userBan = { reason: banReason, createdAt: new Date().toISOString() }

  return true
}

const unbanUser = (_: unknown, { userId }: { userId: number }) => {
  const user = MOCK_USERS.find((candidate) => candidate.id === userId)

  if (!user) {
    throw new GraphQLError(`User not found. Id: ${userId}`)
  }

  user.userBan = undefined

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
  const page = paginate(users, pageNumber, pageSize)

  return {
    users: page.items,
    pagination: {
      pagesCount: page.pagesCount,
      page: page.page,
      pageSize: page.pageSize,
      totalCount: page.totalCount,
    },
  }
}

const getUser = (_: unknown, { userId }: { userId: number }) => {
  const user = MOCK_USERS.find((candidate) => candidate.id === userId)

  if (!user) {
    throw new GraphQLError(`User not found. Id: ${userId}`)
  }

  return user
}

type PageArgs = {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: string | null
  sortDirection?: string | null
}

const normalizePageArgs = (args: PageArgs) => ({
  pageNumber: args.pageNumber ?? 1,
  pageSize: args.pageSize ?? 10,
  sortDirection: args.sortDirection ?? 'desc',
  sortBy: args.sortBy ?? 'createdAt',
})

const paginate = <T>(items: T[], pageNumber: number, pageSize: number) => ({
  items: items.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
  pagesCount: Math.ceil(items.length / pageSize),
  page: pageNumber,
  pageSize,
  totalCount: items.length,
})

const PAYMENT_TYPES: Array<'STRIPE' | 'PAYPAL' | 'CREDIT_CARD'> = [
  'STRIPE',
  'PAYPAL',
  'STRIPE',
  'CREDIT_CARD',
]

const buildUserPayments = (userId: number) =>
  Array.from({ length: 12 }, (_, index) => {
    const weekly = index % 2 === 0
    const createdAt = new Date(Date.UTC(2022, 11, 12 - index, 12, 0, 0)).toISOString()
    const endDate = new Date(Date.UTC(2022, 11, 19 - index, 12, 0, 0)).toISOString()

    return {
      id: `payment-${userId}-${index + 1}`,
      businessAccountId: 1,
      status: 'ACTIVE',
      dateOfPayment: createdAt,
      startDate: createdAt,
      endDate,
      type: weekly ? ('WEEKLY' as const) : ('DAY' as const),
      price: weekly ? 50 : 10,
      paymentType: PAYMENT_TYPES[index % PAYMENT_TYPES.length],
      payments: [],
    }
  })

const getPaymentsByUser = (_: unknown, args: PageArgs & { userId: number }) => {
  const { userId, ...pageArgs } = args
  const { pageNumber, pageSize, sortBy, sortDirection } = normalizePageArgs(pageArgs)
  const payments = buildUserPayments(userId)
  const direction = sortDirection === 'asc' ? 1 : -1

  payments.sort((a, b) => {
    const aValue = sortBy === 'paymentType' ? a.paymentType : (a.dateOfPayment ?? '')
    const bValue = sortBy === 'paymentType' ? b.paymentType : (b.dateOfPayment ?? '')

    return aValue.localeCompare(bValue) * direction
  })

  return paginate(payments, pageNumber, pageSize)
}

const buildFollowItems = (userId: number, offset: number) => {
  const pool = MOCK_USERS.filter((user) => user.id !== userId)

  return pool.slice(offset, offset + 15).map((user, index) => ({
    id: offset + index + 1,
    userId: user.id,
    userName: user.userName,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    createdAt: user.createdAt,
  }))
}

const getFollowers = (_: unknown, args: PageArgs & { userId: number }) => {
  const { userId, ...pageArgs } = args
  const { pageNumber, pageSize, sortBy, sortDirection } = normalizePageArgs(pageArgs)
  const items = buildFollowItems(userId, 0)
  const direction = sortDirection === 'asc' ? 1 : -1

  items.sort((a, b) => {
    const aValue = sortBy === 'userName' ? a.userName : a.createdAt
    const bValue = sortBy === 'userName' ? b.userName : b.createdAt

    return aValue.localeCompare(bValue) * direction
  })

  return paginate(items, pageNumber, pageSize)
}

const getFollowing = (_: unknown, args: PageArgs & { userId: number }) => {
  const { userId, ...pageArgs } = args
  const { pageNumber, pageSize, sortBy, sortDirection } = normalizePageArgs(pageArgs)
  const items = buildFollowItems(userId, 15)
  const direction = sortDirection === 'asc' ? 1 : -1

  items.sort((a, b) => {
    const aValue = sortBy === 'userName' ? a.userName : a.createdAt
    const bValue = sortBy === 'userName' ? b.userName : b.createdAt

    return aValue.localeCompare(bValue) * direction
  })

  return paginate(items, pageNumber, pageSize)
}

const getPostsByUser = (_: unknown, { userId }: { userId: number }) => {
  const images = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    createdAt: MOCK_USERS.find((user) => user.id === userId)?.createdAt ?? '2022-12-12T12:00:00Z',
    url: `https://picsum.photos/seed/u${userId}-p${index + 1}/200/200`,
    width: 200,
    height: 200,
    fileSize: 200,
  }))

  return {
    pagesCount: 1,
    pageSize: 12,
    totalCount: images.length,
    items: images,
  }
}

type MockImagePost = {
  id: number
  createdAt: string
  url: string
  width: number
  height: number
  fileSize: number
}

type MockPost = {
  id: number
  ownerId: number
  description: string
  createdAt: string
  updatedAt: string
  images: MockImagePost[]
}

const POST_DESCRIPTIONS = [
  'Morning coffee ritual',
  'City lights at night',
  'Weekend hike recap',
  'New project sneak peek',
  'Homemade pasta night',
  'Studio session vibes',
  'Sunset from the rooftop',
  'Books I am reading this month',
] as const

const buildMockPostImages = (postId: number, createdAt: string, count: number): MockImagePost[] =>
  Array.from({ length: count }, (_, index) => ({
    id: postId * 10 + index + 1,
    createdAt,
    url: `https://picsum.photos/seed/post-${postId}-${index + 1}/400/400`,
    width: 400,
    height: 400,
    fileSize: 400,
  }))

const buildMockPosts = (): MockPost[] => {
  const owners = MOCK_USERS.slice(0, 20)

  return Array.from({ length: 45 }, (_, index) => {
    const id = index + 1
    const owner = owners[index % owners.length]
    const createdAt = new Date(Date.UTC(2023, 0, 45 - index, 10, 0, 0)).toISOString()
    const imagesCount = index % 5 === 0 ? 0 : (index % 3) + 1

    return {
      id,
      ownerId: owner.id,
      description: POST_DESCRIPTIONS[index % POST_DESCRIPTIONS.length],
      createdAt,
      updatedAt: createdAt,
      images: buildMockPostImages(id, createdAt, imagesCount),
    }
  })
}

const MOCK_POSTS: MockPost[] = buildMockPosts()

/** Restores the seed after mutating operations — for tests and dev reloads. */
export const resetMockPosts = () => {
  MOCK_POSTS.length = 0
  MOCK_POSTS.push(...buildMockPosts())
}

type GetPostsArgs = {
  endCursorPostId?: number | null
  searchTerm?: string | null
  pageSize?: number | null
  sortBy?: string | null
  sortDirection?: string | null
}

const getPosts = (_: unknown, args: GetPostsArgs) => {
  const pageSize = args.pageSize ?? 10
  const sortDirection = args.sortDirection ?? 'desc'
  const searchTerm = args.searchTerm ?? ''

  let posts = [...MOCK_POSTS]

  if (searchTerm) {
    const term = searchTerm.toLowerCase()

    posts = posts.filter((post) =>
      (MOCK_USERS.find((user) => user.id === post.ownerId)?.userName ?? '')
        .toLowerCase()
        .includes(term)
    )
  }

  const direction = sortDirection === 'asc' ? 1 : -1

  posts.sort((a, b) => a.createdAt.localeCompare(b.createdAt) * direction)

  const totalCount = posts.length
  const startIndex = args.endCursorPostId
    ? posts.findIndex((post) => post.id === args.endCursorPostId) + 1
    : 0
  const items = posts.slice(startIndex, startIndex + pageSize)

  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    pageSize,
    totalCount,
    items,
  }
}

const buildPostOwner = (post: MockPost) => {
  const owner = MOCK_USERS.find((user) => user.id === post.ownerId)

  if (!owner) {
    throw new GraphQLError(`Post owner not found. Id: ${post.ownerId}`)
  }

  return {
    id: owner.id,
    userName: owner.userName,
    firstName: owner.profile.firstName,
    lastName: owner.profile.lastName,
    avatars: owner.profile.avatars,
  }
}

const postAddedPubSub = createPubSub<{ postAdded: [post: MockPost] }>()

let mockPostIdCounter = MOCK_POSTS.length

/** Simulates step 3 of the UC (a new post arriving) — no real publishing app exists in the repo. */
const publishMockPost = () => {
  mockPostIdCounter += 1

  const id = mockPostIdCounter
  const owner = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]
  const createdAt = new Date().toISOString()
  const post: MockPost = {
    id,
    ownerId: owner.id,
    description: `Live post #${id}`,
    createdAt,
    updatedAt: createdAt,
    images: buildMockPostImages(id, createdAt, 1),
  }

  MOCK_POSTS.unshift(post)
  postAddedPubSub.publish('postAdded', post)
}

declare global {
  var __mockPostAddedInterval: NodeJS.Timeout | undefined
}

/** Dev-only trigger: without this, `postAdded` never fires since no real client publishes posts. */
const startMockPostAddedLoop = () => {
  if (process.env.NODE_ENV !== 'development' || globalThis.__mockPostAddedInterval) {
    return
  }

  globalThis.__mockPostAddedInterval = setInterval(publishMockPost, 15_000)
}

startMockPostAddedLoop()

export const createServerSchema = () =>
  createSchema({
    typeDefs,
    resolvers: {
      Mutation: {
        loginAdmin: (_: unknown, { email, password }: { email: string; password: string }) => ({
          logged: email === ADMIN_EMAIL && password === ADMIN_PASSWORD,
        }),
        removeUser,
        banUser,
        unbanUser,
      },
      Query: {
        getUsers,
        getUser,
        getPaymentsByUser,
        getFollowers,
        getFollowing,
        getPostsByUser,
        getPosts,
      },
      Subscription: {
        postAdded: {
          subscribe: () => postAddedPubSub.subscribe('postAdded'),
          resolve: (post: MockPost) => post,
        },
      },
      Post: {
        postOwner: buildPostOwner,
        userBan: (post: MockPost) => MOCK_USERS.find((user) => user.id === post.ownerId)?.userBan,
      },
    },
  })
