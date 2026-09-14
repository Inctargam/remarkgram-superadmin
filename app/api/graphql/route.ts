import { createYoga } from 'graphql-yoga'
import type { NextRequest } from 'next/server'

import { createServerSchema } from '@/shared/api/graphql/server'

const yoga = createYoga({
  schema: createServerSchema(),
  graphqlEndpoint: '/api/graphql',
})

export const GET = (request: NextRequest) => yoga.handleRequest(request, {})

export const POST = (request: NextRequest) => yoga.handleRequest(request, {})
