<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import { apiFetch } from '@/axios'
import type { Commande } from '@/types/Commande'
import type { Cocktail } from '@/types/Cocktail'

const commandes = ref<Commande[]>([])
const cocktails  = ref<Cocktail[]>([])

const STATUTS = ['EN_ATTENTE', 'EN_PREPARATION', 'TERMINEE']

function getCocktailName(idCocktail: number): string {
  const c = cocktails.value.find(c => c.id === idCocktail)
  return c?.libelle ?? ''
}

async function load() {
  try {
    commandes.value = await apiFetch<Commande[]>('/commandes')
    cocktails.value  = await apiFetch<Cocktail[]>('/cocktails')
  } catch (e) {
    console.error(e)
  }
}

async function updateCommande(id: number, statut: string) {
  try {
    await apiFetch(`/commandes/${id}?statut=${statut}`, { method: 'PUT' })
    await load()
  } catch (e) {
    console.error(e)
  }
}

async function updateLigne(id: number, statut: string) {
  try {
    await apiFetch(`/commandes/lignes/${id}?statut=${statut}`, { method: 'PUT' })
    await load()
  } catch (e) {
    console.error(e)
  }
}

let intervalId: ReturnType<typeof setInterval>

onMounted(() => {
  load()
  intervalId = setInterval(load, 5000)
})

onUnmounted(() => clearInterval(intervalId))
</script>

<template>
  <main class="commandes-view p-4">
    <h2 class="mb-3">Suivi Commandes</h2>
    <div v-for="cmd in commandes" :key="cmd.id" class="mb-4 p-3 border rounded">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold">
          Commande #{{ cmd.id }} - {{ cmd.idUtilisateur.prenom }} {{ cmd.idUtilisateur.nom }}
        </h3>
        <Dropdown
            :modelValue="cmd.statut"
            :options="STATUTS"
            class="w-40"
            @update:modelValue="val => updateCommande(cmd.id, val as string)"
        />
      </div>

      <DataTable :value="cmd.ligneCommandes" class="p-datatable-sm">
        <!-- libellé cocktail -->
        <Column header="Cocktail">
          <template #body="{ data }">
            {{ getCocktailName(data.idVariante.idCocktail) }}
          </template>
        </Column>

        <Column field="idVariante.taille" header="Taille" />
        <Column field="idVariante.prix" header="Prix" />
        <Column field="qte" header="Quantité" />

        <Column header="Statut">
          <template #body="{ data }">
            <Dropdown
                :modelValue="data.statut"
                :options="STATUTS"
                class="w-32"
                @update:modelValue="val => updateLigne(data.id, val as string)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </main>
</template>
