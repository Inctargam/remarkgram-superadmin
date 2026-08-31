'use client'

import {Button} from '@remark-gram/ui-kit'
import Link from 'next/link'
import type {ReactNode} from 'react'

import styles from './header.module.css'

type AuthVariant = {
    variant: 'auth'
    notificationCount?: number
    onBellClick?: () => void
    languageSelector?: ReactNode
    logo?: ReactNode
}

type GuestVariant = {
    variant: 'guest'
    loginLabel?: string
    languageSelector?: ReactNode
    showAuthActions?: boolean
    logo?: ReactNode
}

export type HeaderProps = AuthVariant | GuestVariant

export const Header = (props: HeaderProps) => {
    const {variant, languageSelector} = props

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link className={styles.logo} href="/">
                    {props.logo ?? 'Remarkgram'}
                </Link>

                <div className={styles.controls}>
                    {variant === 'auth' && (
                        <button
                            aria-label="Notifications"
                            className={styles.bell}
                            type="button"
                            onClick={props.onBellClick}>
                        </button>
                    )}

                    {languageSelector}

                    {variant === 'guest' && (props.showAuthActions ?? true) && (
                        <Button nativeButton={false} render={<Link href="/sign-in"/>} variant="text">
                            {props.loginLabel ?? 'Sign In'}
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
