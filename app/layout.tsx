import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { ApolloProvider } from '@/providers/ApolloProvider'
import { AppShell } from '@/widgets/app-shell'

export const metadata: Metadata = {
  title: 'Inctagram Superadmin',
  description: 'Inctagram superadmin application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider>
          <AppShell>{children}</AppShell>
        </ApolloProvider>
      </body>
    </html>
  )
}
