import type {
  GetPostsQuery,
  PostAddedSubscription,
} from '@/shared/api/graphql/__generated__/graphql'

export { GetPostsDocument, PostAddedDocument } from './api/documents'
export { usePostAddedSubscription } from './api/usePostAddedSubscription'
export { POSTS_PAGE_SIZE, usePostsQuery } from './api/usePostsQuery'
export type {
  GetPostsQueryVariables as GetPostsInput,
  SortDirection,
} from '@/shared/api/graphql/__generated__/graphql'

export type PostsPaginationModel = GetPostsQuery['getPosts']
export type Post = PostsPaginationModel['items'][number]
export type PostImage = NonNullable<Post['images']>[number]
export type PostOwner = Post['postOwner']
export type PostBan = NonNullable<Post['userBan']>
export type PostAdded = PostAddedSubscription['postAdded']
