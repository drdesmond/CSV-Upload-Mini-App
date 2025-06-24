import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MemoryStore } from './storage/memory.store';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, MemoryStore],
})
export class AppModule {} 