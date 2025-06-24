import axios from 'axios';
import type { UploadResponse, ValidateResponse, User } from '@/types/User';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function uploadCsv(file: File, dryRun: boolean = false): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/upload${dryRun ? '?dryRun=true' : ''}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function revalidateUser(data: Partial<User>): Promise<ValidateResponse> {
  const response = await api.post('/validate', data);
  return response.data;
}

export async function downloadCsv(): Promise<void> {
  const response = await api.get('/export', {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data;
}
