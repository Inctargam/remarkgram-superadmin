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
