import { IsEmail, IsDateString, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  first_name!: string;

  @IsNotEmpty({ message: 'Last name is required' })
  last_name!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsDateString({}, { message: 'Birthdate must be a valid date string' })
  birthdate!: string;

  @Matches(/^\+?\d{7,15}$/, { message: 'Phone number must be 7-15 digits with optional + prefix' })
  phone_number!: string;
}
