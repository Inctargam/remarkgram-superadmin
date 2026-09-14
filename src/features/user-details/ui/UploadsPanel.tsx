'use client'

import type { PostsByUserModel } from '../api/usePostsByUserQuery'
import styles from './uploadsPanel.module.css'

type Props = {
  isLoading: boolean
  model: PostsByUserModel | undefined
}

export const UploadsPanel = ({ isLoading, model }: Props) => {
  const images = model?.items?.filter((post) => post.url) ?? []

  if (isLoading) {
    return <div className={styles.grid} aria-busy="true" />
  }

  return (
    <div className={styles.grid}>
      {images.map((post) => (
        <img
          key={post.id}
          alt=""
          className={styles.image}
          height={post.height ?? 200}
          loading="lazy"
          src={post.url as string}
          width={post.width ?? 200}
        />
      ))}
    </div>
  )
}
