'use client'

import { useQuery } from '@apollo/client/react'

import type { GetPostsQueryVariables } from '@/shared/api/graphql/__generated__/graphql'

import { GetPostsDocument } from './documents'

export const POSTS_PAGE_SIZE = 12

export const usePostsQuery = (input: GetPostsQueryVariables) => {
  const { data, ...result } = useQuery(GetPostsDocument, {
    variables: input,
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  return { ...result, data: data?.getPosts }
}
