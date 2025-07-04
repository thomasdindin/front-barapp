import { apiFetch } from '@/axios'
import type { Cocktail } from '@/types/Cocktail'

export function getCocktails() {
  return apiFetch<Cocktail[]>('/cocktails')
}

export function getCocktail(id: number) {
  return apiFetch<Cocktail>(`/cocktails/${id}`)
}

export function getCocktailsByCategory() {
  return apiFetch<Record<string, Cocktail[]>>('/cocktails/by-category')
}

export function createCocktail(data: any) {
  return apiFetch<Cocktail>('/cocktails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function updateCocktail(data: any) {
  return apiFetch<Cocktail>('/cocktails', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function deleteCocktail(id: number) {
  return apiFetch<void>(`/cocktails/${id}`, { method: 'DELETE' })
}
