import type { Variante } from './Variante'

export interface LigneCommande {
  id: number
  qte: number
  statut: string
  idVariante: Variante
}
