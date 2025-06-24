<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <Form
      @submit="handleRevalidate"
      :validation-schema="userSchema"
      :validate-on-mount="true"
      v-slot="{ errors, isSubmitting }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> First Name * </label>
          <Field
            name="first_name"
            v-model="editedData.first_name"
            type="text"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500 bg-red-50': errors.first_name }"
          />
          <ErrorMessage name="first_name" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Last Name * </label>
          <Field
            name="last_name"
            v-model="editedData.last_name"
            type="text"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500 bg-red-50': errors.last_name }"
          />
          <ErrorMessage name="last_name" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Email * </label>
          <Field
            name="email"
            v-model="editedData.email"
            type="email"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500 bg-red-50': errors.email }"
          />
          <ErrorMessage name="email" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Birthdate -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Birthdate * </label>
          <Field
            name="birthdate"
            v-model="editedData.birthdate"
            type="date"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500 bg-red-50': errors.birthdate }"
          />
          <ErrorMessage name="birthdate" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Phone Number * </label>
          <Field
            name="phone_number"
            v-model="editedData.phone_number"
            type="tel"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500 bg-red-50': errors.phone_number }"
          />
          <ErrorMessage name="phone_number" class="mt-1 text-sm text-red-600" />
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
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting" class="inline-flex items-center">
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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { revalidateUser } from '@/api';
import { userSchema, type UserFormData } from '@/validation/userSchema';
import type { User } from '@/types/User';

const props = defineProps<{
  userData: Partial<User>;
  rowIndex: number;
}>();

const emit = defineEmits<{
  revalidate: [data: Partial<User>, rowIndex: number];
}>();

// Create a unique key for this row to persist data
const getStorageKey = (rowIndex: number): string => `editable-user-${rowIndex}`;

// Initialize edited data from localStorage or props
const initializeEditedData = (): UserFormData => {
  const storageKey = getStorageKey(props.rowIndex);
  const savedData = localStorage.getItem(storageKey);

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      return {
        first_name: parsed.first_name ?? props.userData.first_name ?? '',
        last_name: parsed.last_name ?? props.userData.last_name ?? '',
        email: parsed.email ?? props.userData.email ?? '',
        birthdate: parsed.birthdate ?? props.userData.birthdate ?? '',
        phone_number: parsed.phone_number ?? props.userData.phone_number ?? '',
      };
    } catch (error) {
      console.warn('Failed to parse saved data for row', props.rowIndex, error);
    }
  }

  // Fallback to original data
  return {
    first_name: props.userData.first_name ?? '',
    last_name: props.userData.last_name ?? '',
    email: props.userData.email ?? '',
    birthdate: props.userData.birthdate ?? '',
    phone_number: props.userData.phone_number ?? '',
  };
};

const editedData = ref<UserFormData>(initializeEditedData());

// Save data to localStorage whenever it changes
const saveToStorage = (data: UserFormData) => {
  const storageKey = getStorageKey(props.rowIndex);
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// Watch for changes and save to localStorage
watch(
  editedData,
  (newData) => {
    saveToStorage(newData);
  },
  { deep: true },
);

// Only reset data when props change if we don't have saved data
watch(
  () => props.userData,
  (newData) => {
    const storageKey = getStorageKey(props.rowIndex);
    const savedData = localStorage.getItem(storageKey);

    // Only reset if there's no saved data for this row
    if (!savedData) {
      editedData.value = {
        first_name: newData.first_name ?? '',
        last_name: newData.last_name ?? '',
        email: newData.email ?? '',
        birthdate: newData.birthdate ?? '',
        phone_number: newData.phone_number ?? '',
      };
    }
  },
  { deep: true },
);

const resetData = () => {
  // Clear saved data from localStorage
  const storageKey = getStorageKey(props.rowIndex);
  localStorage.removeItem(storageKey);

  // Reset to original data
  editedData.value = {
    first_name: props.userData.first_name ?? '',
    last_name: props.userData.last_name ?? '',
    email: props.userData.email ?? '',
    birthdate: props.userData.birthdate ?? '',
    phone_number: props.userData.phone_number ?? '',
  };
};

const handleRevalidate = async (values: UserFormData) => {
  try {
    const result = await revalidateUser(values);
    if (result.valid) {
      // Clear saved data after successful revalidation
      const storageKey = getStorageKey(props.rowIndex);
      localStorage.removeItem(storageKey);

      // Emit the revalidation event with the fixed data
      emit('revalidate', values, props.rowIndex);
    } else if (result.errors) {
      // Handle server-side validation errors
      console.error('Server validation errors:', result.errors);
    }
  } catch (error) {
    console.error('Revalidation error:', error);
  }
};
</script>
