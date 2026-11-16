<script setup>
import { reactive, ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'
import { req, email } from '@/utils/rules'
import { subscribe } from '@/services/newsletterService'

const form = reactive({ email: '' })
const { errors, validate, validateField, setServerErrors } = useFormValidation({
  email: [req('Enter your email address.'), email()],
})
const toast = useToast()
const loading = ref(false)
const done = ref(false)
const formError = ref('')

async function submit() {
  formError.value = ''
  if (!validate(form)) return
  loading.value = true
  try {
    await subscribe(form.email)
    done.value = true
    toast.success("You're on the list.")
  } catch (e) {
    if (e.status === 422) setServerErrors(e)
    else formError.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="done" class="border border-ink bg-white px-6 py-8 text-center" role="status">
    <p class="font-display text-3xl font-bold uppercase">You're in.</p>
    <p class="mt-2 text-graphite">Thanks for subscribing.</p>
  </div>

  <form v-else novalidate class="space-y-4" @submit.prevent="submit">
    <BaseInput
      v-model="form.email" label="Email address" type="email" autocomplete="email"
      placeholder="you@example.com" required :error="errors.email" @blur="validateField('email', form)"
    />
    <p v-if="formError" class="text-[13px] text-error" role="alert">{{ formError }}</p>
    <BaseButton type="submit" block size="lg" :loading="loading">Subscribe</BaseButton>
    <p class="text-center text-[12px] text-graphite">
      By subscribing you agree to our <RouterLink to="/privacy" class="underline hover:text-ink">Privacy Policy</RouterLink>.
    </p>
  </form>
</template>