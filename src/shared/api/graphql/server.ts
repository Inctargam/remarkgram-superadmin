import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createSchema } from 'graphql-yoga'

export const ADMIN_EMAIL = 'admin@gmail.com'
export const ADMIN_PASSWORD = 'admin'

const typeDefs = readFileSync(join(process.cwd(), 'src/shared/api/graphql/schema.graphql'), 'utf-8')

export const createServerSchema = () =>
  createSchema({
    typeDefs,
    resolvers: {
      Mutation: {
        loginAdmin: (_: unknown, { email, password }: { email: string; password: string }) => ({
          logged: email === ADMIN_EMAIL && password === ADMIN_PASSWORD,
        }),
      },
    },
  })
