<!-- src/components/CocktailCard.vue -->
<template>

    <Card class="overflow-hidden border border-accent-200 hover:border hover:border-warning-500" @click="goToDetail" >
      <template #header>
        <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="cocktail.libelle"
            class="cocktail-image"
        />
      </template>
      <template #title>
      <OverlayBadge :value="priceM">
        <h3>{{ cocktail.libelle }}</h3>
      </OverlayBadge>
      </template>
      <template #subtitle>
        <p class="description">{{ cocktail.description }}</p>
      </template>

    </Card>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from 'vue'
import Card from 'primevue/card'
import OverlayBadge from "primevue/overlaybadge";
import router from "@/router";

interface Variante {
  taille: string
  prix: number
}

interface Cocktail {
  id: number
  libelle: string
  description: string
  variantes: Variante[]
}

const props = defineProps<{ cocktail: Cocktail }>()

// Prix pour la taille "M"
const priceM = computed(() => {
  const v = props.cocktail.variantes.find(v => v.taille === 'M')
  return v ? `${v.prix.toFixed(2)} €` : ''
})

// URL de la miniature (200×200)
const imageUrl = ref<string>('')

// Récupère l'image depuis TheCocktailDB
onMounted(async () => {
  try {
    const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            props.cocktail.libelle
        )}`
    )
    const data = await res.json()
    const src: string | undefined = data.drinks?.[0]?.strDrinkThumb
    if (src) {
      imageUrl.value = `${src}/small`
    }
  } catch (err) {
    console.error('Erreur fetch image cocktail:', err)
  }
})

function goToDetail() {
  router.push({ name: 'CocktailDetail', params: { id: props.cocktail.id } })
}
</script>

<style scoped>
.description {
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
