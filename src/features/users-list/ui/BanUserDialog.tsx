'use client'

import { useMutation } from '@apollo/client/react'
import type { SelectOption } from '@remark-gram/ui-kit'
import { Button, Input, Modal, Select } from '@remark-gram/ui-kit'
import { useState } from 'react'

import type { User } from '@/entities/user'

import { BanUserDocument } from '../api/documents'
import { invalidateUsersLists } from '../api/invalidateUsersLists'
import styles from './banUserDialog.module.css'

const OTHER_REASON = 'Another reason'
const REASON_OPTIONS: SelectOption[] = [
  { value: 'Bad behavior', label: 'Bad behavior' },
  { value: 'Advertising placement', label: 'Advertising placement' },
  { value: OTHER_REASON, label: OTHER_REASON },
]

type Props = {
  user: User
  onClose: () => void
}

export const BanUserDialog = ({ user, onClose }: Props) => {
  const [reason, setReason] = useState<string | null>(null)
  const [customReason, setCustomReason] = useState('')
  const [failed, setFailed] = useState(false)
  const [banUser, { loading }] = useMutation(BanUserDocument, {
    refetchQueries: ['GetUsers'],
    update(cache, { data }) {
      invalidateUsersLists(cache, data?.banUser)
    },
  })

  const name = [user.profile.firstName, user.profile.lastName].filter(Boolean).join(' ')
  const banReason = reason === OTHER_REASON ? customReason.trim() : reason
  // TODO: Confirm reason limits, validation, and the real API response with the backend team.
  const canConfirm = Boolean(banReason) && !loading

  const confirm = async () => {
    if (!banReason || loading) return

    setFailed(false)

    try {
      const result = await banUser({ variables: { userId: user.id, banReason } })

      if (result.data?.banUser) {
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
      bodyClassName={styles.banBody}
      className={styles.dialog}
      disablePointerDismissal
      dismissDisabled={loading}
      open
      title="Ban user"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}>
      <p className={styles.message}>
        Are you sure to ban this user, <strong>{name || user.userName}?</strong>
      </p>
      <Select
        className={styles.reason}
        options={REASON_OPTIONS}
        placeholder="Reason for ban"
        renderValue={(value) => (
          <span className={value === OTHER_REASON ? styles.otherReasonValue : undefined}>
            {value}
          </span>
        )}
        triggerClassName={styles.reasonTrigger}
        value={reason}
        onValueChange={(value) => setReason(value)}
      />
      {reason === OTHER_REASON ? (
        <Input
          aria-label="Another reason for ban"
          className={styles.customReason}
          placeholder="Enter reason"
          value={customReason}
          onChange={(event) => setCustomReason(event.target.value)}
        />
      ) : null}
      {failed ? (
        <p className={styles.error} role="alert">
          Failed to ban the user. Please try again.
        </p>
      ) : null}
      <div className={styles.actions}>
        <Button className={styles.action} disabled={loading} type="button" onClick={onClose}>
          No
        </Button>
        <Button
          className={styles.action}
          disabled={!canConfirm}
          type="button"
          variant="outline"
          onClick={confirm}>
          Yes
        </Button>
      </div>
    </Modal>
  )
}
