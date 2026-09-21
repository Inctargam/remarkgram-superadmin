'use client'

import { useSubscription } from '@apollo/client/react'

import type { PostAddedSubscription } from '@/shared/api/graphql/__generated__/graphql'

import { PostAddedDocument } from './documents'

type Options = {
  onPostAdded: (post: PostAddedSubscription['postAdded']) => void
}

/** Kept id-free (`ROOT_SUBSCRIPTION` isn't a normalized entity) — the feature merges by id itself. */
export const usePostAddedSubscription = ({ onPostAdded }: Options) => {
  useSubscription(PostAddedDocument, {
    onData: ({ data }) => {
      const post = data.data?.postAdded

      if (post) {
        onPostAdded(post)
      }
    },
  })
}
