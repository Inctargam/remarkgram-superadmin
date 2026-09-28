import { graphql } from '@/shared/api/graphql/__generated__/gql'

export const GetPostsDocument = graphql(`
  query GetPosts(
    $endCursorPostId: Int
    $searchTerm: String
    $pageSize: Int
    $sortBy: String
    $sortDirection: SortDirection
  ) {
    getPosts(
      endCursorPostId: $endCursorPostId
      searchTerm: $searchTerm
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      items {
        id
        description
        createdAt
        images {
          id
          url
          width
          height
        }
        postOwner {
          id
          userName
          firstName
          lastName
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
      pagesCount
      pageSize
      totalCount
    }
  }
`)

export const PostAddedDocument = graphql(`
  subscription PostAdded {
    postAdded {
      id
      description
      createdAt
      images {
        id
        url
        width
        height
      }
      postOwner {
        id
        userName
        firstName
        lastName
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
`)
