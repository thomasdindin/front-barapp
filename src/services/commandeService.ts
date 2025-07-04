import { apiFetch } from '@/axios'
import type { Commande } from '@/types/Commande'

export function getCommandes() {
  return apiFetch<Commande[]>('/commandes')
}

export function getCommandesByClient(id: number) {
  return apiFetch<Commande[]>(`/commandes/client/${id}`)
}

export function updateCommande(id: number, statut: string) {
  return apiFetch(`/commandes/${id}?statut=${statut}`, { method: 'PUT' })
}

export function updateLigneCommande(id: number, statut: string) {
  return apiFetch(`/commandes/lignes/${id}?statut=${statut}`, { method: 'PUT' })
}
