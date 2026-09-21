'use client'

import { Alert } from '@remark-gram/ui-kit'

import { usePostsList } from '../model/usePostsList'
import { PostsGrid } from './PostsGrid'
import styles from './postsPage.module.css'
import { PostsToolbar } from './PostsToolbar'

export const PostsPage = () => {
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
            onLoadMore={loadMore}
          />
        </>
      )}
    </div>
  )
}
