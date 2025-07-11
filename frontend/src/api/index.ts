import type { UploadResponse, ValidateResponse, User } from '@/types/User';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500';

/**
 *
 *
 * @export
 * @param {File} file
 * @param {boolean} [dryRun=false]
 * @return {*}  {Promise<UploadResponse>}
 */
export async function uploadCsv(file: File, dryRun: boolean = false): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload${dryRun ? '?dryRun=true' : ''}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 *
 *
 * @export
 * @param {Partial<User>} data
 * @return {*}  {Promise<ValidateResponse>}
 */
export async function revalidateUser(data: Partial<User>): Promise<ValidateResponse> {
  const response = await fetch(`${API_BASE_URL}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Validation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save a revalidated user to backend storage
 *
 * @export
 * @param {Partial<User>} data
 * @return {*}  {Promise<User>}
 */
export async function saveRevalidatedUser(data: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/save-revalidated`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to save revalidated user: ${response.statusText}`);
  }

  return response.json();
}

/**
 *
 *
 * @export
 * @return {*}  {Promise<void>}
 */
export async function downloadCsv(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/export`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
