<!-- src/views/BarmakerView.vue -->
<template>
  <div class="card">
    <Tabs v-model="activeRoute">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.label" :value="tab.route">
          <router-link
              custom
              :to="tab.route"
              v-slot="{ href, navigate }"
          >
            <a
                :href="href"
                @click="navigate"
                class="flex items-center gap-2 text-inherit"
            >
              <i :class="tab.icon" />
              <span>{{ tab.label }}</span>
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>

    <!-- rendu de la sous-route active -->
    <router-view class="mt-4" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'

const route = useRoute()

// définition des onglets
const tabs = [
  { route: '/gestion/cocktails',   label: 'Cocktails',        icon: 'pi pi-glass' },
  { route: '/gestion/ingredients', label: 'Ingrédients',      icon: 'pi pi-tags'  },
  { route: '/gestion/orders',      label: 'Suivi Commandes',  icon: 'pi pi-shopping-cart' },
]

const activeRoute = ref(route.path)

// synchronisation quand on navigue manuellement
watch(route, r => {
  activeRoute.value = r.path
})
</script>

<style scoped>
.card {
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 0.5rem;
}
</style>
