<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <!-- Liste des ingrédients -->
    <div class="w-full lg:w-3/4">
      <div class="flex items-center gap-4 mb-2">
        <InputText v-model="globalFilter" placeholder="Recherche..." class="flex-1" />
        <Button label="Nouvel ingrédient" icon="pi pi-plus" class="p-button-success" @click="onNew" />
      </div>
      <DataTable
          :value="ingredients"
          dataKey="id"
          :filters="{ global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS } }"
          filterDisplay="menu"
          responsiveLayout="scroll"
          @rowClick="onRowClick"
      >
        <Column field="libelle" header="Libellé" sortable />
      </DataTable>
    </div>

    <!-- Espace vide ou future colonne -->
    <div class="w-full lg:w-1/4"></div>

    <!-- Dialog création/édition/suppression -->
    <IngredientDialog
        :ingredient="editedIngredient"
        v-model:visible="displayDialog"
        @save="saveIngredient"
        @delete="removeIngredient(editedIngredient.id)"
        @cancel="cancelEdit"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IngredientDialog from '@/components/IngredientDialog.vue'
import { getIngredients, createIngredient, updateIngredient, deleteIngredient as deleteIngredientApi } from '@/services/ingredientService'
import {Ingredient} from "@/types/Ingredient.ts";

// State
const ingredients = ref<Ingredient[]>([])
const globalFilter = ref<string>('')
const displayDialog = ref<boolean>(false)
const editedIngredient = ref<Ingredient>({ id: 0, libelle: '' })

onMounted(async () => {
  await loadIngredients()
})

async function loadIngredients() {
  ingredients.value = await getIngredients()
}

function onRowClick(event: { data: Ingredient }) {
  editedIngredient.value = { ...event.data }
  console.log('Selected ingredient:', editedIngredient.value.id)
  displayDialog.value = true
}

function onNew() {
  editedIngredient.value = { id: 0, libelle: '' }
  displayDialog.value = true
}

function cancelEdit() {
  displayDialog.value = false
}

async function saveIngredient() {
  const ing = editedIngredient.value
  if (ing.id > 0) {
    await updateIngredient({ id: ing.id, libelle: ing.libelle })
  } else {
    await createIngredient({ libelle: ing.libelle })
  }
  displayDialog.value = false
  await loadIngredients()
}

async function removeIngredient(id: number) {
  if (confirm(`Supprimer l'ingrédient ${id} ?`)) {
    try {
      await deleteIngredientApi(id)
      displayDialog.value = false
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
    await loadIngredients()
  }
}


const dialogHeader = computed(() => editedIngredient.value.id > 0 ? "Éditer l'ingrédient" : "Nouvel ingrédient")
</script>
