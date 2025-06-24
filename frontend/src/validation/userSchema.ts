import * as yup from 'yup';

export const userSchema = yup.object({
  first_name: yup.string().required('First name is required').min(1, 'First name cannot be empty'),

  last_name: yup.string().required('Last name is required').min(1, 'Last name cannot be empty'),

  email: yup.string().required('Email is required').email('Please enter a valid email address'),

  birthdate: yup
    .string()
    .required('Birthdate is required')
    .test('age', 'User must be at least 13 years old', function (value) {
      if (!value) return false;
      const birthDate = new Date(value);
      if (isNaN(birthDate.getTime())) return false;

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 13;
    }),

  phone_number: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+?\d{7,15}$/, 'Please enter a valid phone number (7-15 digits)'),
});

export type UserFormData = yup.InferType<typeof userSchema>;
