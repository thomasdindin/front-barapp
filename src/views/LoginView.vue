<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

function submit() {
  auth.login(email.value, password.value).then(() => {
    router.push('/home')
  }).catch((error) => {
    console.error('Login failed:', error)
    // Optionally, handle login failure (e.g., show a notification)
  })
}
</script>

<template>
  <main class="login">
    <h2>Connexion</h2>
    <div class="form">
      <input v-model="email" placeholder="Nom d'utilisateur" />
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <Button @click="submit">Se connecter</Button>
    </div>
  </main>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 200px;
}
</style>
