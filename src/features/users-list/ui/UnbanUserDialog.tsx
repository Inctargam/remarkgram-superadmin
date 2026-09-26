'use client'

import { useMutation } from '@apollo/client/react'
import { Button, Modal } from '@remark-gram/ui-kit'
import { useState } from 'react'

import type { User } from '@/entities/user'

import { UnbanUserDocument } from '../api/documents'
import { invalidateUsersLists } from '../api/invalidateUsersLists'
import styles from './banUserDialog.module.css'

type Props = {
  user: User
  onClose: () => void
}

export const UnbanUserDialog = ({ user, onClose }: Props) => {
  const [failed, setFailed] = useState(false)
  const [unbanUser, { loading }] = useMutation(UnbanUserDocument, {
    refetchQueries: ['GetUsers'],
    update(cache, { data }) {
      invalidateUsersLists(cache, data?.unbanUser)
    },
  })
  const name = [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ')

  const confirm = async () => {
    if (loading) return

    setFailed(false)

    try {
      const result = await unbanUser({ variables: { userId: user.id } })

      if (result.data?.unbanUser) {
        onClose()
      } else {
        setFailed(true)
      }
    } catch {
      setFailed(true)
    }
  }

  return (
    <Modal
      bodyClassName={styles.unbanBody}
      className={styles.dialog}
      disablePointerDismissal
      dismissDisabled={loading}
      open
      title="Un-Ban user"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}>
      <p className={styles.unbanMessage}>
        Are you sure want to un-ban <strong>{name || user.userName}?</strong>
      </p>
      {failed ? (
        <p className={styles.error} role="alert">
          Failed to unban the user. Please try again.
        </p>
      ) : null}
      <div className={styles.unbanActions}>
        <Button className={styles.action} disabled={loading} type="button" onClick={onClose}>
          No
        </Button>
        <Button
          className={styles.action}
          disabled={loading}
          type="button"
          variant="outline"
          onClick={confirm}>
          Yes
        </Button>
      </div>
    </Modal>
  )
}
