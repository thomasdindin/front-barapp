import type { LigneCommande } from './LigneCommande'
import type { Utilisateur } from './Utilisateur'

export interface Commande {
  id: number
  statut: string
  idUtilisateur: Utilisateur
  lignes: LigneCommande[]
}
