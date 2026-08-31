'use client'

import type { ReactNode } from 'react'

import type { NavItemId } from '@/widgets/navigation'

import { AppShellView } from './AppShellView'

type Props = {
  children: ReactNode
  /** Static active sidebar item override for current route. */
  activeSidebarItemId?: NavItemId
}

export const AppShell = ({ children, activeSidebarItemId }: Props) => (
  <AppShellView activeSidebarItemId={activeSidebarItemId}>{children}</AppShellView>
)
