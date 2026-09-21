'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

/**
 * Attaches an IntersectionObserver to the returned sentinel node and calls
 * `onLoadMore` once it enters the viewport. Works even when the grid scrolls
 * inside an `overflow` ancestor rather than the page itself — the browser
 * computes the intersection rect against the actual clipping chain regardless
 * of which element owns the scrollbar, so a `root: null` observer is enough.
 *
 * The sentinel is tracked via state (not a plain ref) so the observer is
 * re-attached whenever the node itself appears/disappears — e.g. when the
 * caller only renders it while `hasMore` is true.
 */
export const useInfiniteScroll = ({ hasMore, isLoading, onLoadMore }: Options) => {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null)

  // Latest flags/callback, refreshed after every commit (not during render) so the
  // observer below doesn't need to be torn down and recreated on every render.
  const stateRef = useRef({ hasMore, isLoading, onLoadMore })

  useEffect(() => {
    stateRef.current = { hasMore, isLoading, onLoadMore }
  })

  useEffect(() => {
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      const { hasMore: canLoadMore, isLoading: loading, onLoadMore: loadMore } = stateRef.current

      if (entry.isIntersecting && canLoadMore && !loading) {
        loadMore()
      }
    })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [sentinel])

  return { sentinelRef: setSentinel }
}
