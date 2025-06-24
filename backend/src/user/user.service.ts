import { Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { parse } from 'csv-parse';
import { CreateUserDto } from './dto/create-user.dto';
import { User, InvalidUserRow, UploadResponse, ValidateResponse } from './user.schema';
import { MemoryStore } from '../storage/memory.store';

@Injectable()
export class UserService {
  constructor(private readonly memoryStore: MemoryStore) {}

  async uploadCsv(fileBuffer: Buffer, dryRun: boolean = false): Promise<UploadResponse> {
    const csvContent = fileBuffer.toString('utf-8');
    const records = await this.parseCsv(csvContent);
    
    const valid: User[] = [];
    const invalid: InvalidUserRow[] = [];
    const emailSet = new Set<string>();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowIndex = i + 2; // +2 because CSV has header and we're 0-indexed

      try {
        // Validate the record
        const userDto = plainToClass(CreateUserDto, record);
        const errors = await validate(userDto);

        if (errors.length > 0) {
          invalid.push({
            rowIndex,
            data: record,
            errors: errors.flatMap(error => Object.values(error.constraints || {}))
          });
          continue;
        }

        // Check for duplicate email in this upload
        if (emailSet.has(userDto.email)) {
          invalid.push({
            rowIndex,
            data: record,
            errors: ['Duplicate email in this upload']
          });
          continue;
        }

        // Check for duplicate email in existing users
        const existingUser = await this.memoryStore.findUserByEmail(userDto.email);
        if (existingUser) {
          invalid.push({
            rowIndex,
            data: record,
            errors: ['Email already exists in database']
          });
          continue;
        }

        // Validate age (must be over 13)
        const birthDate = new Date(userDto.birthdate);
        const age = this.calculateAge(birthDate);
        if (age < 13) {
          invalid.push({
            rowIndex,
            data: record,
            errors: ['User must be at least 13 years old']
          });
          continue;
        }

        emailSet.add(userDto.email);

        if (!dryRun) {
          // Save to storage
          const savedUser = await this.memoryStore.createUser(userDto);
          valid.push(savedUser);
        } else {
          // For dry run, create a temporary user object
          const tempUser: User = {
            id: `temp-${i}`,
            ...userDto,
            created_at: new Date()
          };
          valid.push(tempUser);
        }

      } catch (error) {
        invalid.push({
          rowIndex,
          data: record,
          errors: [error.message || 'Unknown validation error']
        });
      }
    }

    return { valid, invalid };
  }

  async validateUser(data: Partial<User>): Promise<ValidateResponse> {
    try {
      const userDto = plainToClass(CreateUserDto, data);
      const errors = await validate(userDto);

      if (errors.length > 0) {
        return {
          valid: false,
          data,
          errors: errors.flatMap(error => Object.values(error.constraints || {}))
        };
      }

      // Check age
      const birthDate = new Date(userDto.birthdate);
      const age = this.calculateAge(birthDate);
      if (age < 13) {
        return {
          valid: false,
          data,
          errors: ['User must be at least 13 years old']
        };
      }

      // Check for existing email
      const existingUser = await this.memoryStore.findUserByEmail(userDto.email);
      if (existingUser) {
        return {
          valid: false,
          data,
          errors: ['Email already exists in database']
        };
      }

      return {
        valid: true,
        user: {
          id: 'temp',
          ...userDto,
          created_at: new Date()
        }
      };
    } catch (error) {
      return {
        valid: false,
        data,
        errors: [error.message || 'Unknown validation error']
      };
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.memoryStore.getAllUsers();
  }

  async exportCsv(): Promise<string> {
    const users = await this.memoryStore.getAllUsers();
    
    const headers = ['first_name', 'last_name', 'email', 'birthdate', 'phone_number'];
    const csvRows = [headers.join(',')];
    
    for (const user of users) {
      const row = headers.map(header => {
        const value = user[header as keyof User];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(row.join(','));
    }
    
    return csvRows.join('\n');
  }

  private async parseCsv(csvContent: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }, (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
} 