<template>
  <div class="w-full">
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
      :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <div class="space-y-4">
        <div class="flex justify-center">
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div>
          <p class="text-lg font-medium text-gray-900">
            {{ isDragOver ? 'Drop your CSV file here' : 'Upload CSV file' }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Drag and drop your CSV file here, or click to browse
          </p>
        </div>

        <div class="flex items-center justify-center space-x-4">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click.stop="triggerFileInput"
          >
            Choose File
          </button>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="dryRun"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-600">Dry run mode</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Hidden file input -->
    <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFileSelect" />

    <!-- Loading state -->
    <div v-if="isUploading" class="mt-4 text-center">
      <div class="inline-flex items-center space-x-2">
        <svg
          class="animate-spin h-5 w-5 text-blue-600"
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
        <span class="text-blue-600">Uploading...</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadCsv } from '@/api';
import type { UploadResponse } from '@/types/User';

const emit = defineEmits<{
  'upload-success': [result: UploadResponse];
  'upload-error': [error: string];
}>();

const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);
const isUploading = ref(false);
const error = ref('');
const dryRun = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;

  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFile(files[0]);
  }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0]);
  }
};

const handleFile = async (file: File) => {
  // Reset state
  error.value = '';
  isUploading.value = true;

  try {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Please select a valid CSV file');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    const result = await uploadCsv(file, dryRun.value);
    emit('upload-success', result);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Upload failed';
    error.value = errorMessage;
    emit('upload-error', errorMessage);
  } finally {
    isUploading.value = false;
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};
</script>
