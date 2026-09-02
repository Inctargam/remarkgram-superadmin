import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { QueryProvider } from '@/providers/QueryProvider'
import { AppShell } from '@/widgets/app-shell'

export const metadata: Metadata = {
  title: 'Inctagram Superadmin',
  description: 'Inctagram superadmin application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  )
}
