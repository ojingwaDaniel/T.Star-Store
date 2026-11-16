<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useFormValidation } from '@/composables/useFormValidation'
import { req, email, phone, minLength, same } from '@/utils/rules'
import { safeRedirect } from '@/utils/redirect'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const form = reactive({ name: '', email: '', phone: '', password: '', confirm: '', terms: false })
const formError = ref('')
const { errors, validate, validateField, setServerErrors } = useFormValidation({
  name: [req('Enter your full name.')],
  email: [req('Enter your email address.'), email()],
  phone: [phone()], // optional
  password: [req('Create a password.'), minLength(8, 'Password must be at least 8 characters.')],
  confirm: [req('Confirm your password.'), same('password', 'Passwords do not match.')],
  terms: [req('Please accept the terms to continue.')],
})

const target = computed(() => safeRedirect(route.query.redirect))
const loginTo = computed(() => ({ name: 'login', query: route.query.redirect ? { redirect: route.query.redirect } : {} }))
watch(() => auth.isAuthenticated, (yes) => { if (yes) router.replace(target.value) }, { immediate: true })

async function submit() {
  if (auth.loading) return
  formError.value = ''
  if (!validate(form)) return
  try {
    await auth.register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password })
    toast.success('Your account has been created.')
  } catch (e) {
    if (e.status === 422) setServerErrors(e)
    else formError.value = e.message || 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div>
    <p class="label-gold">Account</p>
    <h1 class="mt-3 text-6xl">Create account</h1>
    <p class="mt-3 text-graphite">Join T.STAR for a faster checkout.</p>

    <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
      <p v-if="formError" class="border border-error bg-white p-3 text-[14px] text-error" role="alert">{{ formError }}</p>
      <BaseInput v-model="form.name" label="Full name" autocomplete="name" required :error="errors.name" @blur="validateField('name', form)" />
      <BaseInput v-model="form.email" label="Email address" type="email" autocomplete="email" required :error="errors.email" @blur="validateField('email', form)" />
      <BaseInput v-model="form.phone" label="Phone number (optional)" type="tel" autocomplete="tel" placeholder="0803 123 4567" :error="errors.phone" @blur="validateField('phone', form)" />
      <BaseInput v-model="form.password" label="Password" type="password" autocomplete="new-password" required hint="At least 8 characters." :error="errors.password" @blur="validateField('password', form)" />
      <BaseInput v-model="form.confirm" label="Confirm password" type="password" autocomplete="new-password" required :error="errors.confirm" @blur="validateField('confirm', form)" />

      <div>
        <label class="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-graphite">
          <input v-model="form.terms" type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-ink" :aria-invalid="!!errors.terms || undefined" />
          <span>
            I agree to the <RouterLink to="/terms" target="_blank" class="underline underline-offset-4 hover:text-ink">Terms</RouterLink>
            and <RouterLink to="/privacy" target="_blank" class="underline underline-offset-4 hover:text-ink">Privacy Policy</RouterLink>.
          </span>
        </label>
        <p v-if="errors.terms" class="mt-1.5 text-[13px] text-error" role="alert">{{ errors.terms }}</p>
      </div>

      <BaseButton type="submit" block size="lg" :loading="auth.loading">Create account</BaseButton>
    </form>

    <p class="mt-6 text-[14px] text-graphite">
      Already have an account?
      <RouterLink :to="loginTo" class="font-semibold text-ink underline underline-offset-4 hover:text-gold-dark">Sign in</RouterLink>
    </p>
  </div>
</template>