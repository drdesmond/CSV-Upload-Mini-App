<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- First Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> First Name * </label>
        <input
          v-model="editedData.first_name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500 bg-red-50': fieldErrors.first_name }"
          @blur="validateField('first_name')"
        />
        <p v-if="fieldErrors.first_name" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.first_name }}
        </p>
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Last Name * </label>
        <input
          v-model="editedData.last_name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500 bg-red-50': fieldErrors.last_name }"
          @blur="validateField('last_name')"
        />
        <p v-if="fieldErrors.last_name" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.last_name }}
        </p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Email * </label>
        <input
          v-model="editedData.email"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500 bg-red-50': fieldErrors.email }"
          @blur="validateField('email')"
        />
        <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.email }}
        </p>
      </div>

      <!-- Birthdate -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Birthdate * </label>
        <input
          v-model="editedData.birthdate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500 bg-red-50': fieldErrors.birthdate }"
          @blur="validateField('birthdate')"
        />
        <p v-if="fieldErrors.birthdate" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.birthdate }}
        </p>
      </div>

      <!-- Phone Number -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Phone Number * </label>
        <input
          v-model="editedData.phone_number"
          type="tel"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500 bg-red-50': fieldErrors.phone_number }"
          @blur="validateField('phone_number')"
        />
        <p v-if="fieldErrors.phone_number" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.phone_number }}
        </p>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="mt-4 flex justify-end space-x-3">
      <button
        @click="resetData"
        type="button"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset
      </button>
      <button
        @click="handleRevalidate"
        :disabled="isValidating || hasErrors"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isValidating" class="inline-flex items-center">
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Validating...
        </span>
        <span v-else>Revalidate</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { revalidateUser } from '@/api'
import type { User } from '@/types/User'

const props = defineProps<{
  userData: Partial<User>
  rowIndex: number
}>()

const emit = defineEmits<{
  revalidate: [data: Partial<User>, rowIndex: number]
}>()

const editedData = ref<Partial<User>>({ ...props.userData })
const fieldErrors = ref<Record<string, string>>({})
const isValidating = ref(false)

// Reset data when props change
watch(
  () => props.userData,
  (newData) => {
    editedData.value = { ...newData }
    fieldErrors.value = {}
  },
  { deep: true },
)

const hasErrors = computed(() => {
  return Object.keys(fieldErrors.value).length > 0
})

const resetData = () => {
  editedData.value = { ...props.userData }
  fieldErrors.value = {}
}

const validateField = (field: keyof User) => {
  const value = editedData.value[field]

  // Clear previous error
  delete fieldErrors.value[field]

  // Basic validation
  if (!value) {
    fieldErrors.value[field] = `${field.replace('_', ' ')} is required`
    return
  }

  // Email validation
  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value as string)) {
      fieldErrors.value[field] = 'Please enter a valid email address'
    }
  }

  // Phone validation
  if (field === 'phone_number') {
    const phoneRegex = /^\+?\d{7,15}$/
    if (!phoneRegex.test(value as string)) {
      fieldErrors.value[field] = 'Please enter a valid phone number (7-15 digits)'
    }
  }

  // Date validation
  if (field === 'birthdate') {
    const date = new Date(value as string)
    if (isNaN(date.getTime())) {
      fieldErrors.value[field] = 'Please enter a valid date'
    } else {
      const age = calculateAge(date)
      if (age < 13) {
        fieldErrors.value[field] = 'User must be at least 13 years old'
      }
    }
  }
}

const calculateAge = (birthDate: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const handleRevalidate = async () => {
  // Validate all fields first
  const fields: (keyof User)[] = ['first_name', 'last_name', 'email', 'birthdate', 'phone_number']
  fields.forEach((field) => validateField(field))

  if (hasErrors.value) {
    return
  }

  isValidating.value = true

  try {
    const result = await revalidateUser(editedData.value)
    if (result.valid) {
      emit('revalidate', editedData.value, props.rowIndex)
    } else if (result.errors) {
      // Set field errors from server response
      result.errors.forEach((error) => {
        // Try to match error to field
        if (error.includes('email')) {
          fieldErrors.value.email = error
        } else if (error.includes('phone')) {
          fieldErrors.value.phone_number = error
        } else if (error.includes('birthdate') || error.includes('age')) {
          fieldErrors.value.birthdate = error
        } else if (error.includes('first_name')) {
          fieldErrors.value.first_name = error
        } else if (error.includes('last_name')) {
          fieldErrors.value.last_name = error
        }
      })
    }
  } catch (error) {
    console.error('Revalidation error:', error)
  } finally {
    isValidating.value = false
  }
}
</script>
