import { defineStore } from 'pinia'
import { apiFetch } from '../axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    userRole: null as string | null
  }),
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.userRole === 'ROLE_BARMAKER',
  },
  actions: {
    async login(email: string, password: string) {
      const { token, userRole } = await apiFetch<{ token: string }>('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      this.token = token
      this.userRole = userRole
    },
    async register(email: string, password: string, nom: string, prenom: string) {
      const { token } = await apiFetch<{ token: string }>('users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom, prenom })
      })
      this.token = token
    },
    logout() {
      this.token = null;
    }
  },
  persist: true
})
