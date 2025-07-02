<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { apiFetch } from '@/axios'
import type { Commande } from '@/types/Commande'

const commandes = ref<Commande[]>([])

onMounted(async () => {
  try {
    commandes.value = await apiFetch<Commande[]>('/commandes')
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <main class="orders-view p-4">
    <h2 class="mb-3">Mes commandes</h2>
    <div v-for="cmd in commandes" :key="cmd.id" class="mb-4 p-3 border rounded">
      <h3 class="mb-2">Commande #{{ cmd.id }} - {{ cmd.statut }}</h3>
      <DataTable :value="cmd.lignes" class="p-datatable-sm">
        <Column field="idVariante.taille" header="Taille" />
        <Column field="idVariante.prix" header="Prix" />
        <Column field="qte" header="Quantité" />
        <Column field="statut" header="Statut" />
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
