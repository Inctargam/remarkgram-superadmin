'use client'

import { useState } from 'react'

import { Header, type HeaderLanguage, HeaderLanguageSwitcher } from '@/widgets/header'
import { Logo } from '@/widgets/logo'

import styles from './page.module.css'

export default function Home() {
  const [language, setLanguage] = useState<HeaderLanguage>('en')

  return (
    <>
      <Header
        languageSelector={<HeaderLanguageSwitcher value={language} onValueChange={setLanguage} />}
        logo={<Logo />}
        variant="auth"
      />
      <main className={styles.page}>
        <h1 className={styles.title}>Remarkgram Superadmin</h1>
      </main>
    </>
  )
}
