'use client'

import type { User } from '@/entities/user'
import { formatShortDate } from '@/shared/lib/date'

import styles from './userInfoCard.module.css'

type Props = {
  user: User
}

export const UserInfoCard = ({ user }: Props) => {
  const name = [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ')
  const avatarUrl = user.profile.avatars?.[0]?.url

  return (
    <div className={styles.card}>
      {avatarUrl ? (
        <img
          alt={`${user.userName} avatar`}
          className={styles.avatar}
          height={48}
          src={avatarUrl}
          width={48}
        />
      ) : null}
      <div className={styles.names}>
        <div className={styles.name}>{name || user.userName}</div>
        <div className={styles.username}>{user.userName}</div>
      </div>
      <div className={styles.info}>
        <div className={styles.pair}>
          <span className={styles.label}>UserID</span>
          <span className={styles.value}>{user.id}</span>
        </div>
        <div className={styles.pair}>
          <span className={styles.label}>Profile link</span>
          <span className={styles.value}>{user.userName}</span>
        </div>
        <div className={styles.pair}>
          <span className={styles.label}>Profile Creation Date</span>
          <span className={styles.value}>{formatShortDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
