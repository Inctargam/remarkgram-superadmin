'use client'

import { BlockIcon, Card, ImageOutlineIcon } from '@remark-gram/ui-kit'

import type { Post, PostOwner } from '@/entities/post'
import { formatShortDate } from '@/shared/lib/date'

import { useInfiniteScroll } from '../shared/lib/useInfiniteScroll'
import styles from './postsGrid.module.css'

const EMPTY_MESSAGE = 'Posts not found.'

type Props = {
  hasMore: boolean
  isLoading: boolean
  isLoadingMore: boolean
  posts: Post[]
  onBlockOwnerClick: (owner: PostOwner) => void
  onLoadMore: () => void
}

export const PostsGrid = ({
  hasMore,
  isLoading,
  isLoadingMore,
  posts,
  onBlockOwnerClick,
  onLoadMore,
}: Props) => {
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore,
  })

  if (isLoading) {
    return <div className={styles.grid} aria-busy="true" />
  }

  if (posts.length === 0) {
    return <p className={styles.emptyMessage}>{EMPTY_MESSAGE}</p>
  }

  return (
    <>
      <div className={styles.grid}>
        {posts.map((post) => {
          const image = post.images?.[0]

          return (
            <Card key={post.id} className={styles.card} padding="none">
              <div className={styles.imageWrapper}>
                {image?.url ? (
                  <img
                    alt=""
                    className={styles.image}
                    height={image.height ?? 400}
                    loading="lazy"
                    src={image.url}
                    width={image.width ?? 400}
                  />
                ) : (
                  <ImageOutlineIcon aria-hidden className={styles.placeholderIcon} size={48} />
                )}
                {post.userBan ? (
                  <BlockIcon aria-hidden className={styles.blockIcon} size={24} />
                ) : (
                  <button
                    aria-label={`Block ${post.postOwner.userName}`}
                    className={styles.blockButton}
                    type="button"
                    onClick={() => onBlockOwnerClick(post.postOwner)}>
                    <BlockIcon aria-hidden size={24} />
                  </button>
                )}
              </div>
              <p className={styles.description}>{post.description}</p>
              <p className={styles.date}>{formatShortDate(post.createdAt)}</p>
            </Card>
          )
        })}
      </div>
      {hasMore ? <div ref={sentinelRef} className={styles.sentinel} /> : null}
    </>
  )
}
