'use client'

import type { ReactNode } from 'react'

import type { NavItemId } from '@/widgets/navigation'

import { AppShellView } from './AppShellView'

type Props = {
  children: ReactNode
  /** Static active sidebar item override for current route. */
  activeSidebarItemId?: NavItemId
  /** Whether to render the sidebar. Auth pages render without it. */
  hasSidebar?: boolean
}

export const AppShell = ({ children, activeSidebarItemId, hasSidebar }: Props) => (
  <AppShellView activeSidebarItemId={activeSidebarItemId} hasSidebar={hasSidebar}>
    {children}
  </AppShellView>
)
