<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <!-- Liste des catégories -->
    <div class="w-full lg:w-3/4">
      <div class="flex items-center gap-4 mb-2">
        <InputText v-model="globalFilter" placeholder="Recherche..." class="flex-1" />
        <Button
            label="Nouvelle catégorie"
            icon="pi pi-plus"
            class="p-button-success"
            @click="onNew"
        />
      </div>
      <DataTable
          :value="categories"
          dataKey="idCategorie"
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
    <Dialog
        :header="dialogHeader"
        v-model:visible="displayDialog"
        modal
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="libelle">Libellé</label>
          <InputText id="libelle" v-model="editedCategory.libelle" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
              label="Annuler"
              icon="pi pi-times"
              class="p-button-text"
              @click="cancelEdit"
          />
          <Button
              v-if="editedCategory.idCategorie > 0"
              label="Supprimer"
              icon="pi pi-trash"
              class="p-button-danger"
              @click="deleteCategory(editedCategory.idCategorie)"
          />
          <Button
              label="Enregistrer"
              icon="pi pi-check"
              @click="saveCategory"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { apiFetch } from '@/axios'
import type { Categorie } from '@/types/Categorie.ts'
import { useAuthStore } from '@/stores/auth.ts'
import axios from 'axios'

// State
const categories = ref<Categorie[]>([])
const globalFilter = ref<string>('')
const displayDialog = ref<boolean>(false)
const editedCategory = ref<Categorie>({ idCategorie: 0, libelle: '' })
const auth = useAuthStore()

// Chargement initial
onMounted(async () => {
  await loadCategories()
})

async function loadCategories() {
  categories.value = await apiFetch<Categorie[]>('/categories')
}

function onRowClick(event: { data: Categorie }) {
  editedCategory.value = { ...event.data }
  displayDialog.value = true
}

function onNew() {
  editedCategory.value = { idCategorie: 0, libelle: '' }
  displayDialog.value = true
}

function cancelEdit() {
  displayDialog.value = false
}

async function saveCategory() {
  const cat = editedCategory.value
  if (cat.idCategorie > 0) {
    await apiFetch<Categorie>(`/categories`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    })
  } else {
    await apiFetch<Categorie>('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({libelle: cat.libelle})
    })
  }
  displayDialog.value = false
  await loadCategories()
}

async function deleteCategory(id: number) {
  if (confirm(`Supprimer la catégorie ${id} ?`)) {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        }
      })
      displayDialog.value = false
    } catch (err) {
      console.error('Erreur lors de la suppression :', err)
    }
    await loadCategories()
  }
}

// En-tête dynamique du dialogue
const dialogHeader = computed(() =>
    editedCategory.value.idCategorie > 0 ? 'Éditer la catégorie' : 'Nouvelle catégorie'
)
</script>
