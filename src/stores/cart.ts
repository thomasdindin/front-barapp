import { defineStore } from 'pinia'
import type { Cocktail } from '@/types/Cocktail'
import type { Variante } from '@/types/Variante'

export interface CartItem {
  cocktail: Cocktail
  variante: Variante
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0)
  },
  actions: {
    addItem(cocktail: Cocktail, variante: Variante, quantity = 1) {
      const found = this.items.find(
        (i) => i.cocktail.id === cocktail.id && i.variante.taille === variante.taille
      )
      if (found) {
        found.quantity += quantity
      } else {
        this.items.push({ cocktail, variante, quantity })
      }
    },
    removeItem(index: number) {
      this.items.splice(index, 1)
    },
    updateQuantity(index: number, quantity: number) {
      if (quantity <= 0) {
        this.removeItem(index)
      } else {
        this.items[index].quantity = quantity
      }
    },
    clear() {
      this.items = []
    }
  },
  persist: true
})
