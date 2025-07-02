<template>
  <main>
    <Button icon="pi pi-arrow-left" class="p-button-text mb-3" @click="$router.back()"/>
    <div v-if="loading" class="text-center">
      <Skeleton width="100%" height="2rem" class="mb-2"/>
      <Skeleton width="100%" height="1rem" class="mb-1" v-for="i in 3" :key="i"/>
    </div>
    <div v-else class="p-shadow-2 flex  flex-col md:flex-row gap-2 p-6">
      <Image  :src="imageUrl" :alt="cocktail.libelle" class="flex flex-1" style="object-fit:cover"/>
      <div class="flex flex-col flex-1 gap-3">
        <h1 class="title">{{cocktail.libelle}}</h1>
        <p class="mb-4">
          {{cocktail.description}}
        </p>
        <Panel header="Ingrédients" class="mb-4">
          <ul class="list-disc pl-4">
            <li v-for="ing in cocktail.ingredients" :key="ing.id">
              {{ing.libelle}}
            </li>
          </ul>
        </Panel>
        <Panel header="Variantes & Prix">
          <DataTable :value="cocktail.variantes" class="p-datatable-sm">
            <Column field="taille" header="Taille"/>
            <Column field="prix" header="Prix (€)"/>
          </DataTable>
        </Panel>
      </div>
  </div>
  </main>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/axios.ts'
import Skeleton from 'primevue/skeleton'
import Panel from "primevue/panel";
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Image from 'primevue/image'

interface Ingredient { id: number; libelle: string }
interface Variante { idVariante: number; taille: string; prix: number }
interface CocktailDetail {
  id: number
  libelle: string
  description: string
  image: string|null
  ingredients: Ingredient[]
  variantes: Variante[]
}

const route = useRoute()
const id = Number(route.params.id)

const loading = ref(true)
const cocktail = ref<CocktailDetail|null>(null)

// URL de la miniature (200×200)
const imageUrl = ref<string>(cocktail.image || '')

onMounted(async () => {
  try {
    // 1) On charge les données du cocktail
    cocktail.value = await apiFetch<CocktailDetail>(`/cocktails/${id}`)

    // 2) Si on a déjà une URL dans l'entité, on l'affiche
    if (cocktail.value?.image) {
      imageUrl.value = cocktail.value.image
    }
    // 3) Sinon, on remonte sur l'API publique
    else if (cocktail.value) {
      const name = encodeURIComponent(cocktail.value.libelle)
      const res  = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
      )
      const data = await res.json()
      // 'strDrinkThumb' est bien l'URL de l'image
      const src  = data.drinks?.[0]?.strDrinkThumb
      if (src) {
        // si vous voulez vraiment une miniature, vérifiez si /small existe
        imageUrl.value = `${src}/medium`
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ton style… */
</style>
