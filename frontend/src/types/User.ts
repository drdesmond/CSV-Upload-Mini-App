export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  phone_number: string;
  created_at: Date;
};

export type InvalidUserRow = {
  rowIndex: number;
  data: Partial<User>;
  errors: string[];
};

export type UploadResponse = {
  valid: User[];
  invalid: InvalidUserRow[];
};

export type ValidateResponse = {
  valid?: boolean;
  user?: User;
  rowIndex?: number;
  data?: Partial<User>;
  errors?: string[];
};
