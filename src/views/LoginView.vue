<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormValidation } from '@/composables/useFormValidation'
import { req, email } from '@/utils/rules'
import { safeRedirect } from '@/utils/redirect'
import { USE_MOCKS } from '@/config/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const form = reactive({ email: '', password: '' })
const formError = ref('')
const { errors, validate, validateField, setServerErrors } = useFormValidation({
  email: [req('Enter your email address.'), email()],
  password: [req('Enter your password.')],
})

const target = computed(() => safeRedirect(route.query.redirect))
const registerTo = computed(() => ({ name: 'register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }))

// Covers both "already signed in" and "just signed in"
watch(() => auth.isAuthenticated, (yes) => { if (yes) router.replace(target.value) }, { immediate: true })

async function submit() {
  if (auth.loading) return
  formError.value = ''
  if (!validate(form)) return
  try {
    const user = await auth.login({ email: form.email.trim(), password: form.password })
    toast.success(`Welcome back, ${user.name.split(' ')[0]}.`)
  } catch (e) {
    if (e.status === 422) setServerErrors(e)
    else formError.value = e.message || 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div>
    <p class="label-gold">Account</p>
    <h1 class="mt-3 text-6xl">Sign in</h1>
    <p class="mt-3 text-graphite">Welcome back. Sign in to check out faster.</p>

    <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
      <p v-if="formError" class="border border-error bg-white p-3 text-[14px] text-error" role="alert">{{ formError }}</p>
      <BaseInput v-model="form.email" label="Email address" type="email" autocomplete="email" required :error="errors.email" @blur="validateField('email', form)" />
      <BaseInput v-model="form.password" label="Password" type="password" autocomplete="current-password" required :error="errors.password" />
      <BaseButton type="submit" block size="lg" :loading="auth.loading">Sign in</BaseButton>
    </form>

    <p class="mt-6 text-[14px] text-graphite">
      New to T.STAR?
      <RouterLink :to="registerTo" class="font-semibold text-ink underline underline-offset-4 hover:text-gold-dark">Create an account</RouterLink>
    </p>

    <p v-if="USE_MOCKS" class="mt-8 border border-line bg-white p-4 text-[13px] leading-relaxed text-graphite">
      <strong class="text-ink">Demo account:</strong> demo@tstar.example / Password123<br />
      Accounts in this demo exist only in this browser.
    </p>
  </div>
</template>