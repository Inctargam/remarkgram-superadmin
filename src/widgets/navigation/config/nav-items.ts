import {
  CreditCardOutlineIcon,
  ImageOutlineIcon,
  PersonIcon,
  TrendingUpOutlineIcon,
} from '@remark-gram/ui-kit'

import type { NavItem } from '../model/types'

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'users',
    label: 'Users list',
    href: '/users',
    icon: PersonIcon,
  },
  {
    id: 'statistics',
    label: 'Statistics',
    href: '/statistics',
    icon: TrendingUpOutlineIcon,
  },
  {
    id: 'payments',
    label: 'Payments list',
    href: '/payments',
    icon: CreditCardOutlineIcon,
  },
  {
    id: 'posts',
    label: 'Posts list',
    href: '/posts',
    icon: ImageOutlineIcon,
  },
]
