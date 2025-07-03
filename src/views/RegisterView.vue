<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const nom = ref('')
const prenom = ref('')

function submit() {
  auth.register(email.value, password.value, nom.value, prenom.value).then(() => {
    router.push('/login')
  }).catch((error) => {
    console.error('Registration failed:', error)
    // Optionally, handle registration failure (e.g., show a notification)
  })
}
</script>

<template>
  <main class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-sm p-6 rounded-lg shadow-lg bg-white dark:bg-slate-800">
      <h1 class="text-center text-2xl font-bold mb-4">Bar'App</h1>
      <h2 class="text-xl mb-4 text-center">Inscription</h2>
      <div class="flex flex-col gap-3">
        <InputText v-model="nom" placeholder="Nom" class="w-full" />
        <InputText v-model="prenom" placeholder="Prénom" class="w-full" />
        <InputText v-model="email" placeholder="Email" class="w-full" />
        <InputText v-model="password" type="password" placeholder="Mot de passe" class="w-full" />
        <Button @click="submit" label="S'inscrire" />
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
