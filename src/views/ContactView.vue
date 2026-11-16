<script setup>
import { reactive, ref } from 'vue'
import { Mail, Phone, MapPin, Clock } from 'lucide-vue-next'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'
import { req, email, phone, minLength } from '@/utils/rules'
import { sendMessage } from '@/services/contactService'
import { USE_MOCKS } from '@/config/api'
import { SITE } from '@/config/site'

const toast = useToast()
const form = reactive({ name: '', email: '', phone: '', message: '', website: '' }) // website = honeypot
const { errors, validate, validateField, setServerErrors, reset } = useFormValidation({
  name: [req('Enter your name.')],
  email: [req('Enter your email address.'), email()],
  phone: [phone()], // optional
  message: [req('Write a message.'), minLength(10, 'Message must be at least 10 characters.')],
})
const loading = ref(false)
const sent = ref(false)
const formError = ref('')
const socials = SITE.socials.filter((s) => s.href && s.href !== '#')

async function submit() {
  if (loading.value) return
  formError.value = ''
  if (!validate(form)) return
  // Bots fill the hidden field. Pretend success and send nothing.
  if (form.website) { sent.value = true; return }
  loading.value = true
  try {
    await sendMessage({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), message: form.message.trim() })
    sent.value = true
    toast.success('Message sent.')
  } catch (e) {
    if (e.status === 422) setServerErrors(e)
    else formError.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

function again() {
  Object.assign(form, { name: '', email: '', phone: '', message: '', website: '' })
  reset()
  sent.value = false
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-white">
      <div class="shell py-10 md:py-14">
        <p class="label-gold">Contact</p>
        <h1 class="mt-3 text-6xl md:text-8xl">Get in touch</h1>
        <p class="mt-4 max-w-lg text-graphite">Questions about an order, sizing or anything else? Send us a message.</p>
      </div>
    </header>

    <div class="shell grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
      <section class="lg:col-span-7" aria-labelledby="form-title">
        <h2 id="form-title" class="sr-only">Contact form</h2>

        <div v-if="sent" class="border border-ink bg-white p-8 md:p-10" role="status">
          <p class="font-display text-4xl font-bold uppercase">Message received.</p>
          <p class="mt-3 text-graphite">Thanks for reaching out. We'll reply to the email you provided.</p>
          <p v-if="USE_MOCKS" class="mt-3 text-[12px] text-graphite">Demo store: nothing was actually sent.</p>
          <BaseButton class="mt-6" variant="outline" @click="again">Send another message</BaseButton>
        </div>

        <form v-else class="space-y-5" novalidate @submit.prevent="submit">
          <p v-if="formError" class="border border-error bg-white p-3 text-[14px] text-error" role="alert">{{ formError }}</p>
          <div class="grid gap-5 sm:grid-cols-2">
            <BaseInput v-model="form.name" label="Your name" autocomplete="name" required :error="errors.name" @blur="validateField('name', form)" />
            <BaseInput v-model="form.email" label="Email address" type="email" autocomplete="email" required :error="errors.email" @blur="validateField('email', form)" />
          </div>
          <BaseInput v-model="form.phone" label="Phone number (optional)" type="tel" autocomplete="tel" placeholder="0803 123 4567" :error="errors.phone" @blur="validateField('phone', form)" />
          <BaseInput v-model="form.message" label="Message" textarea :rows="6" required :error="errors.message" @blur="validateField('message', form)" />

          <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>Leave this empty <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" /></label>
          </div>

          <BaseButton type="submit" size="lg" :loading="loading">Send message</BaseButton>
        </form>
      </section>

      <aside class="lg:col-span-4 lg:col-start-9" aria-labelledby="info-title">
        <h2 id="info-title" class="text-4xl">Business information</h2>
        <ul class="mt-6 space-y-5 text-[15px]">
          <li class="flex gap-4"><Mail :size="20" class="mt-0.5 shrink-0 text-gold-dark" /><div><p class="label">Email</p><a :href="`mailto:${SITE.email}`" class="hover:text-gold-dark">{{ SITE.email }}</a></div></li>
          <li class="flex gap-4"><Phone :size="20" class="mt-0.5 shrink-0 text-gold-dark" /><div><p class="label">Phone</p><p>{{ SITE.phone }}</p></div></li>
          <li class="flex gap-4"><MapPin :size="20" class="mt-0.5 shrink-0 text-gold-dark" /><div><p class="label">Location</p><p>{{ SITE.address }}</p></div></li>
          <li class="flex gap-4"><Clock :size="20" class="mt-0.5 shrink-0 text-gold-dark" /><div><p class="label">Hours</p><p>{{ SITE.hours }}</p></div></li>
        </ul>

        <div v-if="socials.length" class="mt-8 border-t border-line pt-6">
          <p class="label mb-3">Follow us</p>
          <ul class="flex flex-wrap gap-2">
            <li v-for="s in socials" :key="s.label">
              <a :href="s.href" target="_blank" rel="noopener noreferrer" class="inline-block border border-ink px-4 py-2 text-[12px] font-semibold uppercase tracking-label transition-colors hover:bg-ink hover:text-bone">{{ s.label }}</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>