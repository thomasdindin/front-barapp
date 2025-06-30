import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '../axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const data = await apiFetch<{ token: string }>('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    token.value = data.token
  }

  async function register(username: string, password: string) {
    const data = await apiFetch<{ token: string }>('users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    token.value = data.token
  }

  function logout() {
    token.value = null
  }

  return { token, isAuthenticated, login, register, logout }
})

