export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  phone_number: string;
  created_at: Date;
}

export interface InvalidUserRow {
  rowIndex: number;
  data: Partial<User>;
  errors: string[];
}

export interface UploadResponse {
  valid: User[];
  invalid: InvalidUserRow[];
}

export interface ValidateResponse {
  valid?: boolean;
  user?: User;
  rowIndex?: number;
  data?: Partial<User>;
  errors?: string[];
} 