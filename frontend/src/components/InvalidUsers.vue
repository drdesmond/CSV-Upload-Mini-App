<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            @click="isExpanded = !isExpanded"
            class="flex items-center text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            <svg
              class="w-5 h-5 mr-2 transition-transform duration-200"
              :class="{ 'rotate-90': isExpanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            Invalid Users ({{ invalidUsers.length }})
          </button>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-1 ml-7">
        Fix the errors below and revalidate to add these users
      </p>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded" class="overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div v-for="invalidUser in invalidUsers" :key="invalidUser.rowIndex" class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-3">
                  <span class="text-sm font-medium text-gray-900">
                    Row {{ invalidUser.rowIndex }}
                  </span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    {{ invalidUser.errors.length }} error{{
                      invalidUser.errors.length !== 1 ? 's' : ''
                    }}
                  </span>
                </div>

                <!-- Error messages -->
                <div class="mb-4">
                  <ul class="list-disc list-inside space-y-1">
                    <li
                      v-for="error in invalidUser.errors"
                      :key="error"
                      class="text-sm text-red-600"
                    >
                      {{ error }}
                    </li>
                  </ul>
                </div>

                <!-- Editable user data -->
                <EditableUserRow
                  :user-data="invalidUser.data"
                  :row-index="invalidUser.rowIndex"
                  @revalidate="handleRevalidate"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="invalidUsers.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No validation errors</h3>
          <p class="mt-1 text-sm text-gray-500">All users in your CSV file are valid!</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EditableUserRow from './EditableUserRow.vue';
import type { InvalidUserRow } from '@/types/User';

defineProps<{
  invalidUsers: InvalidUserRow[];
}>();

const emit = defineEmits<{
  revalidate: [data: any, rowIndex: number];
}>();

const isExpanded = ref(true);

const handleRevalidate = (data: any, rowIndex: number) => {
  emit('revalidate', data, rowIndex);
};
</script>
