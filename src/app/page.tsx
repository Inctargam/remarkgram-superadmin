'use client'

import { useState } from 'react'

import { Header, type HeaderLanguage, HeaderLanguageSwitcher } from '@/widgets/header'
import { Logo } from '@/widgets/logo'
import { Sidebar } from '@/widgets/navigation'

import styles from './page.module.css'

export default function Home() {
  const [language, setLanguage] = useState<HeaderLanguage>('en')

  return (
    <div className={styles.page}>
      <Header
        languageSelector={<HeaderLanguageSwitcher value={language} onValueChange={setLanguage} />}
        logo={<Logo />}
        variant="auth"
      />
      <div className={styles.content}>
        <div className={styles.sidebarSlot}>
          <Sidebar activeItemId="posts" />
        </div>
        <main className={styles.main}>
          <h1 className={styles.title}>Remarkgram Superadmin</h1>
        </main>
      </div>
    </div>
  )
}
