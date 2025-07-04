<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { apiFetch } from '@/axios'
import type { Commande } from '@/types/Commande'
import type { Cocktail } from '@/types/Cocktail'
import { useAuthStore } from '@/stores/auth.ts'

const auth = useAuthStore()
const commandes = ref<Commande[]>([])
const cocktails = ref<Cocktail[]>([])

/**
 * Renvoie le libellé d'un cocktail à partir de son id.
 */
function getCocktailName(idCocktail: number): string {
  const c = cocktails.value.find(c => c.id === idCocktail)
  return c?.libelle ?? ''
}

onMounted(async () => {
  try {
    // on charge en parallèle les commandes du client et la liste des cocktails
    const [cmds, cts] = await Promise.all([
      apiFetch<Commande[]>(`/commandes/client/${auth.userId}`),
      apiFetch<Cocktail[]>('/cocktails')
    ])
    commandes.value = cmds
    cocktails.value = cts
    console.log('Commandes chargées:', commandes.value)
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <main class="orders-view p-4">
    <h2 class="mb-3">Mes commandes</h2>
    <div
        v-for="cmd in commandes"
        :key="cmd.id"
        class="mb-4 p-3 border rounded"
    >
      <h3 class="mb-2">
        Commande #{{ cmd.id }} – {{ cmd.statut }}
      </h3>
      <DataTable :value="cmd.ligneCommandes" class="p-datatable-sm">
        <!-- Nouvelle colonne : nom du cocktail -->
        <Column header="Cocktail">
          <template #body="{ data }">
            {{ getCocktailName(data.idVariante.idCocktail) }}
          </template>
        </Column>
        <Column field="idVariante.taille" header="Taille" />
        <Column field="idVariante.prix" header="Prix" />
        <Column field="qte"            header="Quantité" />
        <Column field="statut"         header="Statut" />
      </DataTable>
    </div>
  </main>
</template>

<style scoped>
.orders-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
