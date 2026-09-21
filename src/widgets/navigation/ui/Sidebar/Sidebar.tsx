'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { NAV_ITEMS } from '../../config/nav-items'
import { isPathActive } from '../../lib/is-path-active'
import type { NavItem, NavItemId } from '../../model/types'
import { NavLink } from '../NavLink/NavLink'
import styles from './Sidebar.module.css'

type Props = {
  /** Content rendered at the bottom of the sidebar (e.g. footer actions). */
  footer?: ReactNode
  items?: NavItem[]
  className?: string
  /** Static active item override. Use it in static pages; otherwise active item is
   * resolved from the current pathname via usePathname. */
  activeItemId?: NavItemId
}

export const Sidebar = ({ footer, items = NAV_ITEMS, className, activeItemId }: Props) => {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary navigation" className={clsx(styles.root, className)}>
      <div className={styles.navList}>
        {items.map((item) => (
          <NavLink
            key={item.id}
            className={styles.navItem}
            isActive={activeItemId ? item.id === activeItemId : isPathActive(pathname, item.href)}
            item={item}
          />
        ))}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  )
}
