import { apiFetch } from '@/axios'
import type { Ingredient } from '@/types/Ingredient'

export function getIngredients() {
  return apiFetch<Ingredient[]>('/ingredients')
}

export function createIngredient(data: { libelle: string }) {
  return apiFetch<Ingredient>('/ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function updateIngredient(id: number, data: { libelle: string }) {
  return apiFetch<Ingredient>(`/ingredients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function deleteIngredient(id: number) {
  return apiFetch<void>(`/ingredients/${id}`, { method: 'DELETE' })
}
