import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

export type SessionStatus = 'loading' | 'authenticated' | 'guest'

export type CurrentUser = {
  avatarUrl: string | null
  email: string
  id: string
  username: string
}

type SessionState = {
  accessToken: string | null
  currentUser: CurrentUser | null
  status: SessionStatus
  setAuthenticated: (accessToken: string, currentUser?: CurrentUser | null) => void
  setGuest: () => void
}

const SESSION_STORAGE_KEY = 'admin-session'

export const sessionStore = createStore<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      currentUser: null,
      // 'loading' until the persisted session (if any) has been read from
      // localStorage — lets a route guard wait instead of bouncing an
      // already-authenticated user to sign-in for a frame on every page load.
      status: 'loading',
      setAuthenticated: (accessToken, currentUser = null) =>
        set({ accessToken, currentUser, status: 'authenticated' }),
      setGuest: () => set({ accessToken: null, currentUser: null, status: 'guest' }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken, currentUser: state.currentUser }),
      // Reading `localStorage` at store-creation time would crash Next's server
      // render (no `localStorage` in Node). Hydration is triggered manually,
      // client-side only, via `sessionStore.persist.rehydrate()`.
      skipHydration: true,
    }
  )
)

// `partialize` above skips `status`, so a rehydrated `accessToken` alone doesn't
// move the store out of 'loading' — resolve it into 'authenticated'/'guest' here.
sessionStore.persist.onFinishHydration((state) => {
  if (state.accessToken) {
    state.setAuthenticated(state.accessToken, state.currentUser)
  } else {
    state.setGuest()
  }
})
