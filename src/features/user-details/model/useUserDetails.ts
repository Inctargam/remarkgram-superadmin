'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'

import { useFollowersQuery, useFollowingQuery } from '@/entities/follow'
import { usePaymentsByUserQuery } from '@/entities/payment'
import { useUserQuery } from '@/entities/user'

import { usePostsByUserQuery } from '../api/usePostsByUserQuery'

export type UserDetailsTabId = 'uploads' | 'payments' | 'followers' | 'following'

export const USER_DETAILS_TABS: Array<{ id: UserDetailsTabId; label: string }> = [
  { id: 'uploads', label: 'Uploaded files' },
  { id: 'payments', label: 'Payments' },
  { id: 'followers', label: 'Followers' },
  { id: 'following', label: 'Following' },
]

export const ITEMS_PER_PAGE_OPTIONS = [8, 16, 32, 64]

export const DEFAULT_PAGE_SIZE = 8

type Params = {
  userId: string
}

export const useUserDetails = () => {
  const { userId: rawUserId } = useParams<Params>() ?? {}
  const userId = Number(rawUserId)

  const [activeTab, setActiveTab] = useState<UserDetailsTabId>('uploads')
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [paymentsPage, setPaymentsPage] = useState(1)
  const [followersPage, setFollowersPage] = useState(1)
  const [followingPage, setFollowingPage] = useState(1)

  const userQuery = useUserQuery(userId)
  const paymentsQuery = usePaymentsByUserQuery({ userId, pageNumber: paymentsPage, pageSize })
  const followersQuery = useFollowersQuery({
    userId,
    pageNumber: followersPage,
    pageSize,
  })
  const followingQuery = useFollowingQuery({
    userId,
    pageNumber: followingPage,
    pageSize,
  })
  const postsQuery = usePostsByUserQuery(userId)

  const changePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPaymentsPage(1)
    setFollowersPage(1)
    setFollowingPage(1)
  }

  return {
    activeTab,
    changePageSize,
    errorMessage: userQuery.error ? 'Failed to load user. Please try again.' : null,
    followers: followersQuery,
    followersPage,
    following: followingQuery,
    followingPage,
    isLoading: userQuery.loading && !userQuery.data,
    pageSize,
    payments: paymentsQuery,
    paymentsPage,
    posts: postsQuery,
    selectTab: setActiveTab,
    setFollowersPage,
    setFollowingPage,
    setPaymentsPage,
    user: userQuery.data,
    userId,
  }
}
