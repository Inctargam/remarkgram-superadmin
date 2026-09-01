import { createYoga } from 'graphql-yoga'

import { createServerSchema } from '@/shared/api/graphql/server'

const { handleRequest } = createYoga({
  schema: createServerSchema(),
  graphqlEndpoint: '/api/graphql',
})

export { handleRequest as GET, handleRequest as POST }
