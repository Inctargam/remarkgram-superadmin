'use client'

import { ConfirmDialog } from '@remark-gram/ui-kit'

import type { User } from '@/entities/user'

import { useDeleteUserMutation } from '../api/useDeleteUserMutation'
import styles from './deleteUserDialog.module.css'

/** Wording of the UC-3 confirmation. */
export const DELETE_USER_TITLE = 'Delete User'
export const DELETE_USER_MESSAGE = (userName: string) =>
  `Are you sure you want to delete ${userName}?`
const DELETE_ERROR_MESSAGE = 'Failed to delete the user. Please try again.'

type Props = {
  open: boolean
  user: User
  /** `No`, the close icon and a finished deletion all close the confirmation. */
  onOpenChange: (open: boolean) => void
}

export const DeleteUserDialog = ({ open, user, onOpenChange }: Props) => {
  const { error, loading, mutate } = useDeleteUserMutation(user.id)

  const confirmHandler = () => {
    mutate({
      onCompleted: () => {
        onOpenChange(false)
      },
    })
  }

  // While the request is in flight the confirmation stays put, otherwise a failed
  // deletion would have nowhere to be reported.
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && loading) {
      return
    }

    onOpenChange(nextOpen)
  }

  const message = error ? (
    <>
      {DELETE_USER_MESSAGE(user.userName)}
      <span className={styles.error} role="alert">
        {DELETE_ERROR_MESSAGE}
      </span>
    </>
  ) : (
    DELETE_USER_MESSAGE(user.userName)
  )

  return (
    <ConfirmDialog
      className={styles.dialog}
      open={open}
      onOpenChange={openChangeHandler}
      title={DELETE_USER_TITLE}
      message={message}
      confirmLabel="Yes"
      cancelLabel="No"
      confirmDisabled={loading}
      // The deletion is asynchronous: the dialog closes in `onSuccess`, not on the click.
      closeOnConfirm={false}
      onConfirm={confirmHandler}
    />
  )
}
