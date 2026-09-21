'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { sessionStore, useSessionStatus } from '@/shared/auth'
import type { NavItemId } from '@/widgets/navigation'

import { AppShellView } from './AppShellView'

const SIGN_IN_ROUTE = '/sign-in'
const AUTHENTICATED_HOME_ROUTE = '/users'

type Props = {
  children: ReactNode
  /** Static active sidebar item override for current route. */
  activeSidebarItemId?: NavItemId
  /** Whether to render the sidebar. Auth pages render without it. */
  hasSidebar?: boolean
}

export const AppShell = ({ children, activeSidebarItemId, hasSidebar }: Props) => {
  const status = useSessionStatus()
  const pathname = usePathname()
  const router = useRouter()

  // The session store skips auto-hydration (localStorage isn't available during
  // Next's server render), so kick it off once we're definitely on the client.
  useEffect(() => {
    void sessionStore.persist.rehydrate()
  }, [])

  const isSignInRoute = pathname === SIGN_IN_ROUTE
  const isGuestOnProtectedRoute = status === 'guest' && !isSignInRoute
  const isAuthenticatedOnSignInRoute = status === 'authenticated' && isSignInRoute
  const isRedirecting = isGuestOnProtectedRoute || isAuthenticatedOnSignInRoute

  useEffect(() => {
    if (isGuestOnProtectedRoute) {
      router.replace(SIGN_IN_ROUTE)
    } else if (isAuthenticatedOnSignInRoute) {
      router.replace(AUTHENTICATED_HOME_ROUTE)
    }
  }, [isGuestOnProtectedRoute, isAuthenticatedOnSignInRoute, router])

  // While the persisted session is still loading, or a redirect (guest off a
  // protected route, or an already-authenticated user off sign-in) is about to
  // fire, render nothing rather than flashing content that's about to be replaced.
  if (status === 'loading' || isRedirecting) {
    return null
  }

  return (
    <AppShellView
      activeSidebarItemId={activeSidebarItemId}
      hasSidebar={hasSidebar ?? status === 'authenticated'}>
      {children}
    </AppShellView>
  )
}
