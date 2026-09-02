'use client'

import type { SelectOption } from '@remark-gram/ui-kit'
import { Input, Select } from '@remark-gram/ui-kit'

import type { UserBlockStatus } from '@/entities/user'

import styles from './usersToolbar.module.css'

const STATUS_FILTER_OPTIONS: SelectOption<UserBlockStatus>[] = [
  { value: 'ALL', label: 'Not selected' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'UNBLOCKED', label: 'Not Blocked' },
]

type Props = {
  searchValue: string
  statusFilter: UserBlockStatus
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: UserBlockStatus) => void
}

export const UsersToolbar = ({
  searchValue,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: Props) => {
  return (
    <div className={styles.toolbar}>
      <Input
        aria-label="Search users"
        className={styles.search}
        placeholder="Search"
        type="search"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Select
        className={styles.filter}
        options={STATUS_FILTER_OPTIONS}
        value={statusFilter}
        onValueChange={(value) => {
          if (value !== null) {
            onStatusFilterChange(value as UserBlockStatus)
          }
        }}
      />
    </div>
  )
}
