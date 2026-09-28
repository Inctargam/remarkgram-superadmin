'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { OperationTypeNode, print } from 'graphql'
import { createClient } from 'graphql-sse'
import type { ReactNode } from 'react'
import { Observable } from 'rxjs'

const GRAPHQL_ENDPOINT = '/api/graphql'

type Props = {
  children: ReactNode
}

/**
 * `graphql-sse` has no ready-made Apollo link (unlike `graphql-ws`'s `GraphQLWsLink`),
 * so subscriptions are wired to its client manually — see graphql-sse recipes/with-apollo.
 */
const createSseLink = () => {
  const client = createClient({ url: GRAPHQL_ENDPOINT })

  return new ApolloLink(
    (operation) =>
      new Observable((observer) =>
        client.subscribe<Record<string, unknown>, Record<string, unknown>>(
          { ...operation, query: print(operation.query) },
          {
            next: (result) => observer.next(result),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          }
        )
      )
  )
}

const makeClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.split(
      (operation) => operation.operationType === OperationTypeNode.SUBSCRIPTION,
      createSseLink(),
      new HttpLink({ uri: GRAPHQL_ENDPOINT })
    ),
  })

export const ApolloProvider = ({ children }: Props) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
)
