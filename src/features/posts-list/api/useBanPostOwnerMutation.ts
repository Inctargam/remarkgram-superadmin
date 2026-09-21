'use client'

import { useMutation } from '@apollo/client/react'

import { BanUserDocument } from './documents'

/** Bans the owner of a post; the posts feed is refetched so its ban icon updates. */
export const useBanPostOwnerMutation = () => {
  const [mutate, result] = useMutation(BanUserDocument, {
    refetchQueries: ['GetPosts'],
  })

  return { mutate, ...result }
}
