'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { usersQueryKeys } from '@/entities/user'
import { removeUser } from '@/shared/api/graphql/client'

/** UC-3: the user is removed, then the users table is refetched. */
export const useDeleteUserMutation = (userId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => removeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.root })
    },
  })
}
