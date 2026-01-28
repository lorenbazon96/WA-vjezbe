<template>
  <header class="w-full border-b border-slate-200 bg-slate-700 backdrop-blur-sm">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-sm">
          <img
            src="https://png.pngtree.com/png-clipart/20250703/original/pngtree-pizza-logo-transparent-image-free-for-online-download-png-image_21265162.png"
            alt="Logo"
            class="h-5 w-5 object-contain"
          />
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-semibold tracking-wide text-slate-200 uppercase">
            Pizza app
          </span>
          <span class="text-[11px] text-slate-200"> Fresh • Fast • Hot </span>
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-200">
        <template v-if="!loggedIn">
          <input
            v-model="username"
            placeholder="Username"
            class="rounded px-2 py-1 text-black text-xs"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="rounded px-2 py-1 text-black text-xs"
          />
          <button @click="login" class="rounded bg-orange-500 px-2 py-1 text-white">Login</button>
        </template>

        <template v-else>
          <span class="text-[11px]">Prijavljen</span>
          <button @click="logout" class="rounded bg-red-500 px-2 py-1 text-white">Logout</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const username = ref('')
const password = ref('')
const loggedIn = ref(!!localStorage.getItem('jwt_token'))

async function login() {
  const res = await api.post('/auth/login', {
    username: username.value,
    password: password.value,
  })

  localStorage.setItem('jwt_token', res.data.token)
  loggedIn.value = true
}

async function register() {
  await api.post('/auth/register', {
    username: username.value,
    password: password.value,
  })

  await login()
}

function logout() {
  localStorage.removeItem('jwt_token')
  loggedIn.value = false
}
</script>
