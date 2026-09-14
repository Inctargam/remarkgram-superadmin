import type { IconProps } from '@remark-gram/ui-kit'
import type { ComponentType } from 'react'

export type NavItemId = 'users' | 'statistics' | 'payments' | 'posts'

export type NavItem = {
  id: NavItemId
  label: string
  href: string
  /** Icon component rendered when the item is inactive (default state). */
  icon: ComponentType<IconProps>
  disabled?: boolean
}
