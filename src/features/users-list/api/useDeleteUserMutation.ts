'use client'

import { useMutation } from '@apollo/client/react'

import { RemoveUserDocument } from './documents'

/** UC-3: the user is removed, then the active users list is refetched. */
export const useDeleteUserMutation = (userId: number) => {
  const [mutate, result] = useMutation(RemoveUserDocument, {
    variables: { userId },
    refetchQueries: ['GetUsers'],
  })

  return { mutate, ...result }
}
