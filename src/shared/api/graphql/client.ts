const GRAPHQL_ENDPOINT = '/api/graphql'

type GraphQLPayload<TData> = {
  data?: TData
  errors?: Array<{ message: string }>
}

export const graphqlRequest = async <TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as GraphQLPayload<TData>

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message)
  }

  return payload.data as TData
}

export type LoginAdminInput = {
  email: string
  password: string
}

type LoginAdminData = {
  loginAdmin: {
    logged: boolean
  }
}

const LOGIN_ADMIN_MUTATION = /* GraphQL */ `
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      logged
    }
  }
`

export const loginAdmin = async (input: LoginAdminInput): Promise<boolean> => {
  const data = await graphqlRequest<LoginAdminData>(LOGIN_ADMIN_MUTATION, input)

  return data.loginAdmin.logged
}

export type SortDirection = 'asc' | 'desc'

export type UserBlockStatus = 'ALL' | 'BLOCKED' | 'UNBLOCKED'

export type GetUsersInput = {
  pageNumber?: number
  pageSize?: number
  sortBy?: 'userName' | 'createdAt'
  sortDirection?: SortDirection
  searchTerm?: string
  statusFilter?: UserBlockStatus
}

export type UserBan = {
  reason: string
  createdAt: string
}

export type User = {
  id: number
  userName: string
  email: string
  createdAt: string
  profile: {
    id: number
    userName: string
    firstName: string | null
    lastName: string | null
    createdAt: string
    avatars?: Array<{ url: string; width: number; height: number }> | null
  }
  userBan: UserBan | null
}

export type UsersPaginationModel = {
  users: User[]
  pagination: {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
  }
}

const GET_USERS_QUERY = /* GraphQL */ `
  query GetUsers(
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
    $searchTerm: String
    $statusFilter: UserBlockStatus
  ) {
    getUsers(
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchTerm: $searchTerm
      statusFilter: $statusFilter
    ) {
      users {
        id
        userName
        createdAt
        profile {
          id
          firstName
          lastName
        }
        userBan {
          reason
          createdAt
        }
      }
      pagination {
        pagesCount
        page
        pageSize
        totalCount
      }
    }
  }
`

export const getUsers = async (input: GetUsersInput = {}): Promise<UsersPaginationModel> => {
  const data = await graphqlRequest<{ getUsers: UsersPaginationModel }>(GET_USERS_QUERY, input)

  return data.getUsers
}

const REMOVE_USER_MUTATION = /* GraphQL */ `
  mutation RemoveUser($userId: Int!) {
    removeUser(userId: $userId)
  }
`

export const removeUser = async (userId: number): Promise<boolean> => {
  const data = await graphqlRequest<{ removeUser: boolean }>(REMOVE_USER_MUTATION, { userId })

  return data.removeUser
}

export type SubscriptionByPaymentModel = {
  id: string
  businessAccountId: number
  status: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'DELETED'
  dateOfPayment: string | null
  startDate: string | null
  endDate: string | null
  type: 'MONTHLY' | 'DAY' | 'WEEKLY'
  price: number | null
  paymentType: 'STRIPE' | 'PAYPAL' | 'CREDIT_CARD' | null
}

export type PaymentPaginationModel = {
  items: SubscriptionByPaymentModel[]
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export type GetPaymentsByUserInput = {
  userId: number
  pageNumber?: number
  pageSize?: number
  sortBy?: 'dateOfPayment' | 'paymentType' | 'status' | 'createdAt'
  sortDirection?: SortDirection
}

const GET_PAYMENTS_BY_USER_QUERY = /* GraphQL */ `
  query GetPaymentsByUser(
    $userId: Int!
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getPaymentsByUser(
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        status
        dateOfPayment
        endDate
        type
        price
        paymentType
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`

export const getPaymentsByUser = async (
  input: GetPaymentsByUserInput
): Promise<PaymentPaginationModel> => {
  const data = await graphqlRequest<{ getPaymentsByUser: PaymentPaginationModel }>(
    GET_PAYMENTS_BY_USER_QUERY,
    input
  )

  return data.getPaymentsByUser
}

export type Follow = {
  id: number
  userId: number
  userName: string | null
  firstName: string | null
  lastName: string | null
  createdAt: string
}

export type FollowPaginationModel = {
  items: Follow[]
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export type FollowListInput = {
  userId: number
  pageNumber?: number
  pageSize?: number
  sortBy?: 'userName' | 'createdAt'
  sortDirection?: SortDirection
}

const GET_FOLLOWERS_QUERY = /* GraphQL */ `
  query GetFollowers(
    $userId: Int!
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getFollowers(
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        userName
        firstName
        lastName
        createdAt
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`

const GET_FOLLOWING_QUERY = /* GraphQL */ `
  query GetFollowing(
    $userId: Int!
    $pageNumber: Int
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getFollowing(
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        userName
        firstName
        lastName
        createdAt
      }
      pagesCount
      page
      pageSize
      totalCount
    }
  }
`

export const getFollowers = async (input: FollowListInput): Promise<FollowPaginationModel> => {
  const data = await graphqlRequest<{ getFollowers: FollowPaginationModel }>(
    GET_FOLLOWERS_QUERY,
    input
  )

  return data.getFollowers
}

export const getFollowing = async (input: FollowListInput): Promise<FollowPaginationModel> => {
  const data = await graphqlRequest<{ getFollowing: FollowPaginationModel }>(
    GET_FOLLOWING_QUERY,
    input
  )

  return data.getFollowing
}

export type ImagePost = {
  id: number | null
  createdAt: string | null
  url: string | null
  width: number | null
  height: number | null
}

export type PostsByUserModel = {
  pagesCount: number
  pageSize: number
  totalCount: number
  items: ImagePost[] | null
}

const GET_USER_QUERY = /* GraphQL */ `
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      id
      userName
      createdAt
      profile {
        id
        userName
        firstName
        lastName
        createdAt
        avatars {
          url
          width
          height
        }
      }
      userBan {
        reason
        createdAt
      }
    }
  }
`

export const getUser = async (userId: number): Promise<User> => {
  const data = await graphqlRequest<{ getUser: User }>(GET_USER_QUERY, { userId })

  return data.getUser
}

const GET_POSTS_BY_USER_QUERY = /* GraphQL */ `
  query GetPostsByUser($userId: Int!) {
    getPostsByUser(userId: $userId) {
      pagesCount
      pageSize
      totalCount
      items {
        id
        url
        width
        height
      }
    }
  }
`

export const getPostsByUser = async (userId: number): Promise<PostsByUserModel> => {
  const data = await graphqlRequest<{ getPostsByUser: PostsByUserModel }>(GET_POSTS_BY_USER_QUERY, {
    userId,
  })

  return data.getPostsByUser
}
