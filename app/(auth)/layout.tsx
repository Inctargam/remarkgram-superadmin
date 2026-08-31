import type { ReactNode } from 'react'

import { AppShell } from '@/widgets/app-shell'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AppShell hasSidebar={false}>{children}</AppShell>
}
