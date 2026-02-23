import { create } from 'zustand'

type Mode = 'login' | 'signup'

type AuthStore = {
  mode: Mode
  message: string
  showpassword: boolean
  setshowPassword: (show: boolean) => void
  togglePassword: () => void
  setMode: (mode: Mode) => void
  setMessage: (msg: string) => void
  toggleMode: () => void
  clearMessage: () => void

}

export const useAuthStore = create<AuthStore>((set) => ({
  mode: 'login',
  message: '',
  showpassword: false,
  setshowPassword: (show) => set({ showpassword: show }),
  togglePassword: () =>
    set((state) => ({ showpassword: !state.showpassword })),
  
  setMode: (mode) => set({ mode }),

  setMessage: (message) => set({ message }),

  toggleMode: () =>
    set((state) => ({
      mode: state.mode === 'login' ? 'signup' : 'login',
      message: '',
    })),

  clearMessage: () => set({ message: '' }),
  
}))
