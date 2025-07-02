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
    <Dialog :header="dialogHeader" v-model:visible="displayDialog" modal>
      <div class="p-fluid">
        <div class="p-field">
          <label for="libelle">Libellé</label>
          <InputText id="libelle" v-model="editedIngredient.libelle" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="cancelEdit" />
          <Button label="Supprimer" icon="pi pi-trash" class="p-button-danger" v-if="editedIngredient.id > 0" @click="deleteIngredient(editedIngredient.id)" />
          <Button label="Enregistrer" icon="pi pi-check" @click="saveIngredient" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, h, computed} from 'vue'
import {useAuthStore} from "@/stores/auth.ts";
import axios from "axios";
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { apiFetch } from '@/axios'
import {Ingredient} from "@/types/Ingredient.ts";

// State
const ingredients = ref<Ingredient[]>([])
const globalFilter = ref<string>('')
const displayDialog = ref<boolean>(false)
const editedIngredient = ref<Ingredient>({ id: 0, libelle: '' })
const auth = useAuthStore()

onMounted(async () => {
  await loadIngredients()
})

async function loadIngredients() {
  ingredients.value = await apiFetch<Ingredient[]>('/ingredients')
}

function onRowClick(event: { data: Ingredient }) {
  editedIngredient.value = { ...event.data }
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
    await apiFetch<Ingredient>(`/ingredients/${ing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle: ing.libelle })
    })
  } else {
    await apiFetch<Ingredient>('/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle: ing.libelle })
    })
  }
  displayDialog.value = false
  await loadIngredients()
}

async function deleteIngredient(id: number) {
  if (confirm(`Supprimer l'ingrédient ${id} ?`)) {
    axios.delete(`http://localhost:8080/api/ingredients/${id}`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` }

    })
      .then(() => {
        displayDialog.value = false
      })
      .catch(err => {
        console.error('Erreur lors de la suppression:', err)
      })
    await loadIngredients()
  }
}


const dialogHeader = computed(() => editedIngredient.value.id > 0 ? "Éditer l'ingrédient" : "Nouvel ingrédient")
</script>
