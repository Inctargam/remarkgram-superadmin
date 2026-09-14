'use client'

import { HttpLink } from '@apollo/client'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import type { ReactNode } from 'react'

const GRAPHQL_ENDPOINT = '/api/graphql'

type Props = {
  children: ReactNode
}

const makeClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
  })

export const ApolloProvider = ({ children }: Props) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
)
