import { apiFetch } from '@/axios'
import type { Categorie } from '@/types/Categorie'

export function getCategories() {
  return apiFetch<Categorie[]>('/categories')
}

export function createCategory(data: { libelle: string }) {
  return apiFetch<Categorie>('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function updateCategory(cat: Categorie) {
  return apiFetch<Categorie>('/categories', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat)
  })
}

export function deleteCategory(id: number) {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' })
}
