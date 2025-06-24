<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">CSV Upload Mini-App</h1>
        <p class="text-lg text-gray-600">
          Upload CSV files with user data, validate, and manage records
        </p>
      </div>

      <!-- File Uploader Component -->
      <FileUploader @upload-success="handleUploadSuccess" @upload-error="handleUploadError" />

      <!-- Results Display -->
      <div v-if="uploadResult" class="mt-8 space-y-6">
        <!-- Valid Users -->
        <ValidUsers
          v-if="uploadResult.valid.length > 0"
          :users="uploadResult.valid"
          @download-csv="downloadCsv"
        />

        <!-- Invalid Users -->
        <InvalidUsers
          v-if="uploadResult.invalid.length > 0"
          :invalid-users="uploadResult.invalid"
          @revalidate="handleRevalidate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUploader from '@/components/FileUploader.vue';
import ValidUsers from '@/components/ValidUsers.vue';
import InvalidUsers from '@/components/InvalidUsers.vue';
import type { UploadResponse, User } from '@/types/User';
import { downloadCsv as downloadCsvApi, revalidateUser, saveRevalidatedUser } from '@/api';

const uploadResult = ref<UploadResponse | null>(null);

const handleUploadSuccess = (result: UploadResponse) => {
  uploadResult.value = result;
};

const handleUploadError = (error: string) => {
  console.error('Upload error:', error);
  throw new Error(error);
  // You could add a toast notification here
};

const handleRevalidate = async (data: any, rowIndex: number) => {
  try {
    const result = await revalidateUser(data);
    if (result.valid && uploadResult.value) {
      // Save the revalidated user to backend storage
      const savedUser = await saveRevalidatedUser(data);

      // Add the user to the valid users list with the saved user data
      uploadResult.value.valid.push(savedUser);

      // Remove the user from the invalid users list
      uploadResult.value.invalid = uploadResult.value.invalid.filter(
        (user) => user.rowIndex !== rowIndex,
      );

      console.log(`User from row ${rowIndex} successfully revalidated and saved to backend`);
    } else if (result.errors) {
      // Handle server-side validation errors
      console.error('Server validation errors:', result.errors);
    }
  } catch (error) {
    console.error('Revalidation error:', error);
  }
};

const downloadCsv = async () => {
  try {
    await downloadCsvApi();
  } catch (error) {
    console.error('Download error:', error);
  }
};
</script>
