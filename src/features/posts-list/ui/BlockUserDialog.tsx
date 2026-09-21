'use client'

import type { RadioGroupOption } from '@remark-gram/ui-kit'
import { ConfirmDialog, RadioGroup, TextArea } from '@remark-gram/ui-kit'
import { useState } from 'react'

import type { PostOwner } from '@/entities/post'

import { useBanPostOwnerMutation } from '../api/useBanPostOwnerMutation'
import styles from './blockUserDialog.module.css'

/** Wording and reason set of the UC-1 confirmation — see personal/UC-ban-user.md. */
export const BLOCK_USER_TITLE = 'Block User'
export const BLOCK_USER_MESSAGE = (userName: string) => `Are you sure you want to ban ${userName}?`
const BLOCK_ERROR_MESSAGE = 'Failed to block the user. Please try again.'

type BanReason = 'bad-behavior' | 'advertising' | 'other'

const REASON_LABELS: Record<Exclude<BanReason, 'other'>, string> = {
  'bad-behavior': 'Bad behavior',
  advertising: 'Advertising placement',
}

const REASON_OPTIONS: RadioGroupOption<BanReason>[] = [
  { value: 'bad-behavior', label: REASON_LABELS['bad-behavior'] },
  { value: 'advertising', label: REASON_LABELS.advertising },
  { value: 'other', label: 'Another reason' },
]

type Props = {
  open: boolean
  owner: PostOwner
  /** `No`, the close icon and a finished ban all close the confirmation. */
  onOpenChange: (open: boolean) => void
}

export const BlockUserDialog = ({ open, owner, onOpenChange }: Props) => {
  const [reason, setReason] = useState<BanReason>('bad-behavior')
  const [customReason, setCustomReason] = useState('')
  const { error, loading, mutate } = useBanPostOwnerMutation()

  const banReason = reason === 'other' ? customReason.trim() : REASON_LABELS[reason]
  const canConfirm = banReason.length > 0

  const confirmHandler = () => {
    if (!canConfirm) {
      return
    }

    mutate({
      variables: { banReason, userId: owner.id },
      onCompleted: () => {
        onOpenChange(false)
      },
    })
  }

  // While the request is in flight the confirmation stays put, otherwise a failed
  // ban would have nowhere to be reported.
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && loading) {
      return
    }

    if (nextOpen) {
      setReason('bad-behavior')
      setCustomReason('')
    }

    onOpenChange(nextOpen)
  }

  const message = (
    <div className={styles.content}>
      <p className={styles.question}>{BLOCK_USER_MESSAGE(owner.userName)}</p>
      <RadioGroup
        direction="vertical"
        options={REASON_OPTIONS}
        value={reason}
        onValueChange={(value) => setReason(value)}
      />
      {reason === 'other' ? (
        <TextArea
          aria-label="Ban reason"
          placeholder="Enter the reason"
          rows={3}
          value={customReason}
          onChange={(event) => setCustomReason(event.target.value)}
        />
      ) : null}
      {error ? (
        <span className={styles.error} role="alert">
          {BLOCK_ERROR_MESSAGE}
        </span>
      ) : null}
    </div>
  )

  return (
    <ConfirmDialog
      className={styles.dialog}
      open={open}
      onOpenChange={openChangeHandler}
      title={BLOCK_USER_TITLE}
      message={message}
      confirmLabel="Yes"
      cancelLabel="No"
      confirmDisabled={loading || !canConfirm}
      // The ban is asynchronous: the dialog closes in `onCompleted`, not on the click.
      closeOnConfirm={false}
      onConfirm={confirmHandler}
    />
  )
}
