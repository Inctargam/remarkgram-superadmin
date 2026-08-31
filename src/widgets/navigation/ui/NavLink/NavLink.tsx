import Link from 'next/link'

import type { NavItem } from '../../model/types'
import styles from './NavLink.module.css'

type Props = {
  item: NavItem
  isActive: boolean
  /** Extra classes applied to the root element — used by shells to inject layout styles. */
  className?: string
  labelClassName?: string
}

export const NavLink = ({ item, isActive, className, labelClassName }: Props) => {
  const { label, href, icon: IconComponent, disabled } = item

  const content = (
    <>
      <IconComponent className={styles.icon} size={24} />
      <span className={labelClassName ?? styles.label}>{label}</span>
    </>
  )

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={[styles.item, styles.disabled, className].filter(Boolean).join(' ')}>
        {content}
      </span>
    )
  }

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={[styles.item, isActive && styles.active, className].filter(Boolean).join(' ')}
      href={href}>
      {content}
    </Link>
  )
}
