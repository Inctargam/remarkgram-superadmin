'use client'

import { type ReactNode, useRef, useState } from 'react'

import styles from './tooltip.module.css'

const SHOW_DELAY_MS = 2000

type Props = {
  label: string
  children: ReactNode
}

// Shows `label` only after the pointer/focus rests on `children` for SHOW_DELAY_MS —
// a discoverability hint for icon-only controls, not an on-hover-instant tooltip.
// Only sets `position: relative` for its own tooltip bubble — positioning the trigger
// itself (e.g. absolute placement over an image) is the caller's job, via a wrapping
// element, not a merged className here (mixing position rules from two CSS modules
// on one node makes the cascade order unpredictable).
export const Tooltip = ({ label, children }: Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleShow = () => {
    timerRef.current = setTimeout(() => setIsVisible(true), SHOW_DELAY_MS)
  }

  const hide = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setIsVisible(false)
  }

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={scheduleShow}
      onMouseLeave={hide}
      onFocus={scheduleShow}
      onBlur={hide}>
      {children}
      {isVisible ? (
        <span className={styles.tooltip} role="tooltip">
          {label}
        </span>
      ) : null}
    </span>
  )
}
