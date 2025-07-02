<script setup lang="ts">
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const totalPrice = computed(() =>
  cart.items.reduce((sum, i) => sum + i.variante.prix * i.quantity, 0)
)

function updateQty(index: number, value: number) {
  cart.updateQuantity(index, value)
}

function remove(index: number) {
  cart.removeItem(index)
}
</script>

<template>
<main class="cart-view">
  <h2>Mon Panier</h2>
  <div v-if="cart.items.length === 0">
    <p>Votre panier est vide.</p>
    <p>Ajoutez des cocktails pour commencer.</p>
  </div>
  <div v-else>
    <DataTable :value="cart.items" class="p-datatable-sm">
      <Column field="cocktail.libelle" header="Cocktail" />
      <Column field="variante.taille" header="Taille" />
      <Column header="Prix">
        <template #body="{ data }">
          {{ data.variante.prix.toFixed(2) }} €
        </template>
      </Column>
      <Column header="Quantité">
        <template #body="{ data, index }">
          <InputNumber :modelValue="data.quantity" @update:modelValue="val => updateQty(index, val as number)" :min="1" />
        </template>
      </Column>
      <Column>
        <template #body="{ index }">
          <Button icon="pi pi-trash" class="p-button-danger p-button-text" @click="remove(index)" />
        </template>
      </Column>
    </DataTable>
    <div class="total">Total : {{ totalPrice.toFixed(2) }} €</div>
  </div>
</main>
</template>

<style scoped>
.cart-view {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.total {
  margin-top: 1rem;
  text-align: right;
  font-weight: bold;
}
</style>
