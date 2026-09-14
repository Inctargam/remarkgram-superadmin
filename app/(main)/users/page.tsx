import { Suspense } from 'react'

import { UsersPage } from '@/features/users-list'

export default function UsersPageRoute() {
  return (
    <Suspense>
      <UsersPage />
    </Suspense>
  )
}
