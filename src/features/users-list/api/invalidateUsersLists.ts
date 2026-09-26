import type { ApolloCache } from '@apollo/client'

/** A block status change can affect every cached filter, page, and count. */
export const invalidateUsersLists = (cache: ApolloCache, succeeded: boolean | null | undefined) => {
  if (succeeded) {
    cache.evict({ id: 'ROOT_QUERY', fieldName: 'getUsers' })
  }
}
