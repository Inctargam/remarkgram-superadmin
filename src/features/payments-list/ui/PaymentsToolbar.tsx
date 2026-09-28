'use client'

import { Checkbox, Input } from '@remark-gram/ui-kit'

import styles from './paymentsToolbar.module.css'

type Props = {
  autoUpdate: boolean
  searchValue: string
  onAutoUpdateChange: (checked: boolean) => void
  onSearchChange: (value: string) => void
}

export const PaymentsToolbar = ({
  autoUpdate,
  searchValue,
  onAutoUpdateChange,
  onSearchChange,
}: Props) => (
  <>
    <div className={styles.toolbar}>
      <Checkbox checked={autoUpdate} onCheckedChange={onAutoUpdateChange}>
        Autoupdate
      </Checkbox>
    </div>

    <Input
      aria-label="Search payments by username"
      className={styles.search}
      placeholder="Search"
      type="search"
      value={searchValue}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  </>
)
