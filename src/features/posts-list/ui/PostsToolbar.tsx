'use client'

import { Input } from '@remark-gram/ui-kit'

import styles from './postsToolbar.module.css'

type Props = {
  searchValue: string
  onSearchChange: (value: string) => void
}

export const PostsToolbar = ({ searchValue, onSearchChange }: Props) => {
  return (
    <div className={styles.toolbar}>
      <Input
        aria-label="Search posts"
        className={styles.search}
        placeholder="Search by username"
        type="search"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  )
}
