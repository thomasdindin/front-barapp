<script setup lang="ts">
const cocktails = [
  'Mojito',
  'Pina Colada',
  'Cuba Libre',
  'Margarita'
]
</script>

<template>
  <main class="home">
    <h2>Nos Cocktails</h2>
    <ul>
      <li v-for="c in cocktails" :key="c">{{ c }}</li>
    </ul>
  </main>
</template>

<style scoped>
.home {
  padding: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
</style>
