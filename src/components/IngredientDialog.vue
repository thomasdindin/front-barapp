<template>
  <Dialog :header="header" v-model:visible="visible" modal>
    <div class="p-fluid">
      <div class="p-field">
        <label for="libelle">Libellé</label>
        <InputText id="libelle" v-model="ingredient.libelle" />
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Annuler" icon="pi pi-times" class="p-button-text" @click="emit('cancel')" />
        <Button label="Supprimer" icon="pi pi-trash" class="p-button-danger" v-if="ingredient.id > 0" @click="emit('delete')" />
        <Button label="Enregistrer" icon="pi pi-check" @click="emit('save')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import type { Ingredient } from '@/types/Ingredient'

const props = defineProps<{ ingredient: Ingredient; visible: boolean }>()
const emit = defineEmits(['update:visible', 'save', 'delete', 'cancel'])

const visible = computed({
  get: () => props.visible,
  set: val => emit('update:visible', val)
})

const ingredient = props.ingredient

const header = computed(() => ingredient.id > 0 ? "Éditer l'ingrédient" : "Nouvel ingrédient")
</script>
