import { useAuthStore } from './stores/auth'

const BASE_URL = 'http://localhost:8080/api/'

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const auth = useAuthStore()
    const endpoint = url.startsWith('http') ? url : BASE_URL + url.replace(/^\//, '')
    const headers = new Headers(options.headers || {})
    const isAuthRoute = endpoint.endsWith('/auth/login') || endpoint.endsWith('/users/register')
    if (!isAuthRoute && auth.token) {
        headers.set('Authorization', `Bearer ${auth.token}`)
    }
    options.headers = headers
    const response = await fetch(endpoint, options)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json() as Promise<T>
}