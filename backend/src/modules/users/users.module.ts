import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

/**
 * Module quản lý người dùng
 * Export UsersRepository để AuthModule sử dụng
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
