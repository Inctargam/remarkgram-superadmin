'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import { Header, type HeaderLanguage, HeaderLanguageSwitcher } from '@/widgets/header'
import { Logo } from '@/widgets/logo'
import type { NavItemId } from '@/widgets/navigation'
import { Sidebar } from '@/widgets/navigation'

import styles from './AppShell.module.css'

type Props = {
  children: ReactNode
  /** Static active sidebar item override for current route. */
  activeSidebarItemId?: NavItemId
}

export const AppShellView = ({ children, activeSidebarItemId }: Props) => {
  const [language, setLanguage] = useState<HeaderLanguage>('en')
  const languageSelector = <HeaderLanguageSwitcher value={language} onValueChange={setLanguage} />

  return (
    <div className={styles.shell}>
      <Header
        languageSelector={languageSelector}
        logo={<Logo />}
        showAuthActions={false}
        variant="guest"
      />
      <div className={styles.content}>
        <div className={styles.sidebarSlot}>
          <Sidebar activeItemId={activeSidebarItemId} />
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
