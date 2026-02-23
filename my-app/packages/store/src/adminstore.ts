import { create } from 'zustand'

type Stats = {
  totalUsers: number
}

type AdminState = {
  loading: boolean
  isAdmin: boolean
  stats: Stats | null

  setLoading: (v: boolean) => void
  setIsAdmin: (v: boolean) => void
  setStats: (s: Stats | null) => void
  reset: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  loading: true,
  isAdmin: false,
  stats: null,

  setLoading: (v) => set({ loading: v }),
  setIsAdmin: (v) => set({ isAdmin: v }),
  setStats: (s) => set({ stats: s }),

  reset: () =>
    set({
      loading: true,
      isAdmin: false,
      stats: null,
    }),
}))
