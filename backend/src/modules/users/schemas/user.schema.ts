import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../common/decorators/roles.decorator';

/**
 * Schema người dùng
 * - timestamps: tự động thêm createdAt, updatedAt
 * - password & refreshTokenHash: mặc định KHÔNG được select
 */
@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  // SECURITY: select: false → không bao giờ vô tình trả password ra ngoài
  @Prop({ required: true, select: false })
  password!: string;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role!: Role;

  // SECURITY: Lưu HASH của refresh token, không lưu token gốc
  @Prop({ select: false, default: null })
  refreshTokenHash!: string | null;

  // Dùng để vô hiệu hoá toàn bộ token cũ khi đổi mật khẩu / đăng xuất mọi thiết bị
  @Prop({ default: 0 })
  tokenVersion!: number;

  @Prop({ default: 0 })
  failedLoginAttempts!: number;

  @Prop({ type: Date, default: null })
  lockUntil!: Date | null;

  @Prop({ default: null })
  deletedAt!: Date | null;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

// Index cho các trường hay truy vấn
UserSchema.index({ role: 1, createdAt: -1 });
