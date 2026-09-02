import { Suspense } from 'react'

import { UserDetailsPage } from '@/features/user-details'

export default function UserDetailsRoute() {
  return (
    <Suspense>
      <UserDetailsPage />
    </Suspense>
  )
}
