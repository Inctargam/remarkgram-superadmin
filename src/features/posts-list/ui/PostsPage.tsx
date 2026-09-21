'use client'

import { Alert } from '@remark-gram/ui-kit'
import { useState } from 'react'

import type { PostOwner } from '@/entities/post'

import { usePostsList } from '../model/usePostsList'
import { BlockUserDialog } from './BlockUserDialog'
import { PostsGrid } from './PostsGrid'
import styles from './postsPage.module.css'
import { PostsToolbar } from './PostsToolbar'

export const PostsPage = () => {
  const [blockTarget, setBlockTarget] = useState<PostOwner | null>(null)
  const {
    errorMessage,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    posts,
    searchValue,
    changeSearchValue,
    loadMore,
  } = usePostsList()

  const closeBlockDialog = (open: boolean) => {
    if (!open) {
      setBlockTarget(null)
    }
  }

  return (
    <div className={styles.page}>
      {errorMessage ? (
        <Alert variant="error">{errorMessage}</Alert>
      ) : (
        <>
          <PostsToolbar searchValue={searchValue} onSearchChange={changeSearchValue} />
          <PostsGrid
            hasMore={hasMore}
            isLoading={isInitialLoading}
            isLoadingMore={isLoadingMore}
            posts={posts}
            onBlockOwnerClick={setBlockTarget}
            onLoadMore={loadMore}
          />
        </>
      )}

      {blockTarget ? (
        <BlockUserDialog
          open={Boolean(blockTarget)}
          owner={blockTarget}
          onOpenChange={closeBlockDialog}
        />
      ) : null}
    </div>
  )
}
