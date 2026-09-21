// @vitest-environment jsdom
import { MockedProvider } from '@apollo/client/testing/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PostOwner } from '@/entities/post'

import { BanUserDocument } from '../api/documents'
import { BlockUserDialog } from './BlockUserDialog'

const owner: PostOwner = {
  id: 1,
  userName: 'Ivan',
  firstName: null,
  lastName: null,
  avatars: null,
}

describe('BlockUserDialog', () => {
  it('bans the owner with the selected reason and closes on completion', async () => {
    const onOpenChange = vi.fn()
    const mocks = [
      {
        request: {
          query: BanUserDocument,
          variables: { banReason: 'Advertising placement', userId: 1 },
        },
        result: { data: { banUser: true } },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <BlockUserDialog open owner={owner} onOpenChange={onOpenChange} />
      </MockedProvider>
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Advertising placement' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('requires custom text before confirming "Another reason"', () => {
    render(
      <MockedProvider mocks={[]}>
        <BlockUserDialog open owner={owner} onOpenChange={vi.fn()} />
      </MockedProvider>
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Another reason' }))
    const confirmButton = screen.getByRole('button', { name: 'Yes' }) as HTMLButtonElement

    expect(confirmButton.disabled).toBe(true)

    fireEvent.change(screen.getByRole('textbox', { name: 'Ban reason' }), {
      target: { value: 'Custom reason text' },
    })

    expect(confirmButton.disabled).toBe(false)
  })
})
