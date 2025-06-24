import { Injectable } from '@nestjs/common';
import { User } from '../user/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MemoryStore {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const user: User = {
      ...userData,
      id: uuidv4(),
      created_at: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
