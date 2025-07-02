<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <!-- Liste des cocktails -->
    <div class="w-full lg:w-1/2">
      <div class="flex items-center gap-4 mb-2">
        <InputText v-model="globalFilter" placeholder="Recherche..." class="flex-1" />
        <Button label="Nouveau cocktail" icon="pi pi-plus" @click="onNew" />
      </div>
      <DataTable
          :value="cocktails"
          dataKey="id"
          v-model:selection="selectedCocktail"
          selectionMode="single"
          :filters="{ global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS } }"
          filterDisplay="menu"
          responsiveLayout="scroll"
          @rowSelect="onRowSelect"
      >
        <Column field="libelle" header="Libellé" sortable />
        <Column field="categorie.libelle" header="Catégorie" />
      </DataTable>
    </div>

    <!-- Formulaire de création / édition -->
    <div class="w-full lg:w-1/2">
      <div v-if="cocktailForm" class="flex flex-col gap-4">
        <h2 class="text-xl">
          {{ cocktailForm.id > 0 ? 'Modifier le cocktail' : 'Nouveau cocktail' }}
        </h2>

        <!-- Libellé -->
        <div>
          <label class="block mb-1 font-semibold">Libellé</label>
          <InputText v-model="cocktailForm.libelle" class="w-full" />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-1 font-semibold">Description</label>
          <Textarea v-model="cocktailForm.description" rows="3" class="w-full" />
        </div>

        <!-- Catégorie -->
        <div>
          <label class="block mb-1 font-semibold">Catégorie</label>
          <Dropdown
              v-model="selectedCategorieId"
              :options="categories"
              optionLabel="libelle"
              optionValue="idCategorie"
              placeholder="Sélectionnez une catégorie"
              class="w-full"
          />
        </div>

        <!-- Ingrédients -->
        <div>
          <label class="block mb-1 font-semibold">Ingrédients</label>
          <DataTable
              :value="ingredients"
              dataKey="id"
              v-model:selection="selectedIngredients"
              selectionMode="multiple"
              responsiveLayout="scroll"
              class="p-datatable-sm mb-4"
          >
            <Column selectionMode="multiple" headerStyle="width: 3em" />
            <Column field="libelle" header="Libellé" />
          </DataTable>
        </div>

        <!-- Variantes -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="font-semibold">Variantes</label>
            <Button label="Ajouter variante" icon="pi pi-plus" class="p-button-text" @click="addVariant" />
          </div>
          <div v-for="(v, i) in cocktailForm.variantes" :key="i" class="flex gap-4 items-center mb-2">
            <InputText v-model="v.taille" placeholder="Taille" />
            <InputNumber v-model="v.prix" mode="currency" currency="EUR" locale="fr-FR" />
            <Button icon="pi pi-trash" class="p-button-danger" @click="removeVariant(i)" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <Button label="Enregistrer" icon="pi pi-check" @click="saveCocktail" />
          <Button
              v-if="cocktailForm.id > 0"
              label="Supprimer"
              icon="pi pi-trash"
              class="p-button-danger"
              @click="deleteCocktail"
          />
        </div>
      </div>
      <div v-else>
        <p>Sélectionnez un cocktail ou créez-en un nouveau.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {FilterMatchMode} from '@primevue/core/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import {apiFetch} from '@/axios'
import type {Cocktail} from '@/types/Cocktail.ts'
import type {Ingredient} from '@/types/Ingredient.ts'
import type {Categorie} from '@/types/Categorie.ts'
import type {Variante} from '@/types/Variante.ts'


// State
const cocktails = ref<Cocktail[]>([])
const ingredients = ref<Ingredient[]>([])
const categories = ref<Categorie[]>([])
const selectedCocktail = ref<Cocktail | null>(null)
const selectedCategorieId = ref<number | null>(null)
const selectedIngredients = ref<Ingredient[]>([])
const variantes = ref<Variante[]>([])
const globalFilter = ref<string>('')
const cocktailForm = ref<Cocktail | null>(null)

onMounted(async () => {
  await loadCategories()
  await loadIngredients()
  await loadCocktails()
})

// Load data
async function loadCategories() {
  categories.value = await apiFetch<Categorie[]>('/categories')
}
async function loadIngredients() {
  ingredients.value = await apiFetch<Ingredient[]>('/ingredients')
}
async function loadCocktails() {
  cocktails.value = await apiFetch<Cocktail[]>('/cocktails')
}

// Sélection d'une ligne
function onRowSelect(event: { data: Cocktail }) {
  const row = event.data
  cocktailForm.value = {
    id: row.id,
    libelle: row.libelle,
    description: row.description,
    categorie: row.categorie,
    variantes: row.variantes.map(v => ({ ...v })),
    ingredients: row.ingredients.map(i => ({ ...i }))
  }
  selectedCategorieId.value = row.categorie.idCategorie
  selectedIngredients.value = ingredients.value.filter(i =>
      cocktailForm.value!.ingredients.some(ci => ci.id === i.id)
  )
}

// Création d'un nouveau
function onNew() {
  cocktailForm.value = {
    id: null,
    libelle: '',
    description: '',
    categorie: { idCategorie: 0, libelle: '' },
    variantes: [],
    ingredients: []
  }
  selectedCocktail.value = null
  selectedCategorieId.value = null
  selectedIngredients.value = []
}

// Gestion des variantes
function addVariant() {
  cocktailForm.value?.variantes.push({ taille: '', prix: 0, idCocktail: cocktailForm.value!.id })
}
function removeVariant(index: number) {
  cocktailForm.value?.variantes.splice(index, 1)
}

// Enregistrer / Supprimer
async function saveCocktail() {
  if (!cocktailForm.value) return
  const base = cocktailForm.value
  const selectedCategorie = categories.value.find(c => c.idCategorie === selectedCategorieId.value)
  console.log(cocktailForm.value.variantes)

  let payload : any;

    payload = {
      id: base.id ,
      libelle: base.libelle,
      description: base.description,
      categorie: {idCategorie: selectedCategorie?.idCategorie || 0, libelle: selectedCategorie?.libelle || ''},
      ingredients: selectedIngredients.value.map(i => ({ id: i.id })),
      variantes : base.variantes.map(v => ({ taille: v.taille, prix: v.prix, idCocktail: v.idCocktail}))
    }
  let saved: Cocktail
  if (payload.id > 0) {
    saved = await apiFetch<Cocktail>(`/cocktails`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } else {
    // On créé le produit :
    saved = await apiFetch<Cocktail>('/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // On ajoute les variantes
    payload = {
      id: saved.id,
      libelle: base.libelle,
      description: base.description,
      categorie: {idCategorie: selectedCategorie?.idCategorie || 0, libelle: selectedCategorie?.libelle || ''},
      ingredients: selectedIngredients.value.map(i => ({ id: i.id })),
      variantes: base.variantes.map(v => ({ taille: v.taille, prix: v.prix, idCocktail: saved.id}))
    }

    saved = await apiFetch<Cocktail>(`/cocktails`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  onRowSelect({ data: saved })
  await loadCocktails()
}

async function deleteCocktail() {
  if (!cocktailForm.value) return
  if (confirm('Confirmez la suppression ?')) {
    await apiFetch<void>(`/cocktails/${cocktailForm.value.id}`, { method: 'DELETE' })
    cocktailForm.value = null
    selectedCocktail.value = null
    selectedCategorieId.value = null
    selectedIngredients.value = []
    await loadCocktails()
  }
}

</script>
