'use client'

import { Alert, ArrowBackOutlineIcon, Tabs } from '@remark-gram/ui-kit'
import Link from 'next/link'

import { ITEMS_PER_PAGE_OPTIONS, USER_DETAILS_TABS, useUserDetails } from '../model/useUserDetails'
import { FollowPanel } from './FollowPanel'
import { PaymentsPanel } from './PaymentsPanel'
import { UploadsPanel } from './UploadsPanel'
import styles from './userDetailsPage.module.css'
import { UserInfoCard } from './UserInfoCard'

export const UserDetailsPage = () => {
  const {
    user,
    isLoading,
    errorMessage,
    activeTab,
    selectTab,
    pageSize,
    changePageSize,
    payments,
    paymentsPage,
    setPaymentsPage,
    followers,
    followersPage,
    setFollowersPage,
    following,
    followingPage,
    setFollowingPage,
    posts,
  } = useUserDetails()

  if (errorMessage) {
    return <Alert variant="error">{errorMessage}</Alert>
  }

  return (
    <div className={styles.page}>
      <Link className={styles.back} href="/users">
        <ArrowBackOutlineIcon aria-hidden size={24} />
        <span>Back to Users List</span>
      </Link>

      {isLoading || !user ? null : <UserInfoCard user={user} />}

      <Tabs.Root
        className={styles.tabs}
        value={activeTab}
        onValueChange={(value) => selectTab(value as typeof activeTab)}>
        <Tabs.List className={styles.tabsList}>
          {USER_DETAILS_TABS.map((tab) => (
            <Tabs.Tab className={styles.tab} key={tab.id} value={tab.id}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel className={styles.panel} value="uploads">
          <UploadsPanel isLoading={posts.isPending} model={posts.data} />
        </Tabs.Panel>

        <Tabs.Panel className={styles.panel} value="payments">
          <PaymentsPanel
            data={payments.data}
            isLoading={payments.isPending}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            page={paymentsPage}
            pageSize={pageSize}
            onPageChange={setPaymentsPage}
            onPageSizeChange={changePageSize}
          />
        </Tabs.Panel>

        <Tabs.Panel className={styles.panel} value="followers">
          <FollowPanel
            data={followers.data}
            emptyMessage="Followers not found."
            isLoading={followers.isPending}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            page={followersPage}
            pageSize={pageSize}
            onPageChange={setFollowersPage}
            onPageSizeChange={changePageSize}
          />
        </Tabs.Panel>

        <Tabs.Panel className={styles.panel} value="following">
          <FollowPanel
            data={following.data}
            emptyMessage="Following not found."
            isLoading={following.isPending}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            page={followingPage}
            pageSize={pageSize}
            onPageChange={setFollowingPage}
            onPageSizeChange={changePageSize}
          />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}
