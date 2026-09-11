import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './src/shared/api/graphql/schema.graphql',
  documents: [
    'src/**/*.{ts,tsx}',
    '!src/shared/api/graphql/__generated__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
  ignoreNoDocuments: true,
  generates: {
    './src/shared/api/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
        fragmentMasking: false,
      },
      config: {
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
}

export default config
