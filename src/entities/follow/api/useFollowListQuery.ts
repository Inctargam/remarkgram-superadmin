'use client'

import { useQuery } from '@apollo/client/react'

import type {
  GetFollowersQueryVariables,
  GetFollowingQueryVariables,
} from '@/shared/api/graphql/__generated__/graphql'

import { GetFollowersDocument, GetFollowingDocument } from './documents'

export const useFollowersQuery = (input: GetFollowersQueryVariables) => {
  const { data, ...result } = useQuery(GetFollowersDocument, {
    variables: input,
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  return { ...result, data: data?.getFollowers }
}

export const useFollowingQuery = (input: GetFollowingQueryVariables) => {
  const { data, ...result } = useQuery(GetFollowingDocument, {
    variables: input,
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  return { ...result, data: data?.getFollowing }
}
