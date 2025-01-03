import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  login: (email: string) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    set({ isAuthenticated: true })
    localStorage.setItem('isAuthenticated', 'true')
  },
  logout: () => {
    set({ isAuthenticated: false })
    localStorage.removeItem('isAuthenticated')
  }
}))

