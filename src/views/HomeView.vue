<script setup lang="ts">
import { ref } from 'vue'
import DataView from 'primevue/dataview'
import { getCocktailsByCategory } from '@/services/cocktailService'
import Skeleton from 'primevue/skeleton'
import CocktailCard from '@/components/CocktailCard.vue'
import OverlayBadge from "primevue/overlaybadge";

interface Cocktail {
  id: number
  libelle: string
  description: string
  image: string | null
  variantes: { taille: string; prix: number; idCocktail: number }[]
}

type CategoriesResponse = Record<string, Cocktail[]>
interface Category { libelle: string; cocktails: Cocktail[] }

const loading    = ref(true)
const categories = ref<Category[]>([])

getCocktailsByCategory()
    .then(data => {
      categories.value = Object
          .entries(data)
          .map(([libelle, list]) => ({ libelle, cocktails: list }))
    })
    .catch(err => console.error(err))
    .finally(() => { loading.value = false })
</script>

<template>
  <main class="home">

    <div v-if="loading" class="loading-skeletons">
      <Skeleton class="w-full" height="2rem" />
      <Skeleton class="w-full" height="2rem" />
      <Skeleton class="w-full" height="2rem" />
    </div>

    <div v-else class="categories">
      <div
          v-for="cat in categories"
          :key="cat.libelle"
          class="category"
      >
        <h3 class="category-title title-small">{{ cat.libelle }}</h3>

        <DataView
            :value="cat.cocktails"
            layout="grid"
            class="data-view"
        >
          <!-- On n’utilise que le mode grid ici -->
          <template #grid="slotProps">
            <div class="dv-grid">
              <div
                  v-for="item in slotProps.items"
                  :key="item.id"
                  class="dv-item"
              >
                <CocktailCard :cocktail="item" />
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-skeletons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-title {
  margin-bottom: 0.5rem;
}

/* Conteneur horizontal scrollable */
.dv-grid {
  display: flex;
  flex-wrap: nowrap;               /* pas de retour à la ligne */
  overflow-x: auto;                /* scroll horizontal */
  -webkit-overflow-scrolling: touch; /* inertie sur iOS */
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Optionnel : masquer la scrollbar WebKit */
.dv-grid::-webkit-scrollbar {
  display: none;
}

/* Chaque carte garde sa largeur fixe */
.dv-item {
  flex: 0 0 auto;
  width: 200px;
}
</style>
