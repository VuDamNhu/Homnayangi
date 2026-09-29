import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Role } from '../../common/decorators/roles.decorator';

/**
 * Tầng truy cập dữ liệu người dùng
 * Chỉ tầng này được phép thao tác trực tiếp với Model
 */
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  /** Tìm user theo email (kèm password để xác thực đăng nhập) */
  findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, deletedAt: null }).select('+password').exec();
  }

  /** Tìm user theo ID, trả về object thuần để tối ưu hiệu năng */
  findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean<User>().exec();
  }

  /** Tìm user theo ID kèm refreshTokenHash để verify */
  findByIdWithRefreshHash(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('+refreshTokenHash').exec();
  }

  /** Kiểm tra email đã tồn tại chưa */
  existsByEmail(email: string): Promise<boolean> {
    return this.userModel.exists({ email }).then((r) => r !== null);
  }

  /** Tạo user mới */
  create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  /** Cập nhật hash refresh token */
  updateRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    return this.userModel.findByIdAndUpdate(id, { refreshTokenHash: hash }).exec().then(() => void 0);
  }

  /** Reset số lần đăng nhập sai */
  resetLoginAttempts(id: string): Promise<void> {
    return this.userModel
      .findByIdAndUpdate(id, { failedLoginAttempts: 0, lockUntil: null })
      .exec()
      .then(() => void 0);
  }

  /** Tăng số lần đăng nhập sai, khoá tài khoản nếu vượt ngưỡng */
  incrementFailedAttempts(id: string, maxAttempts: number, lockMs: number): Promise<void> {
    return this.userModel
      .findByIdAndUpdate(id, [
        {
          $set: {
            failedLoginAttempts: { $add: ['$failedLoginAttempts', 1] },
            lockUntil: {
              $cond: {
                if: { $gte: [{ $add: ['$failedLoginAttempts', 1] }, maxAttempts] },
                then: new Date(Date.now() + lockMs),
                else: null,
              },
            },
          },
        },
      ])
      .exec()
      .then(() => void 0);
  }

  /** Thu hồi tất cả session: xoá refreshTokenHash + tăng tokenVersion */
  revokeAllSessions(id: string): Promise<void> {
    return this.userModel
      .findByIdAndUpdate(id, { refreshTokenHash: null, $inc: { tokenVersion: 1 } })
      .exec()
      .then(() => void 0);
  }

  /** Seed admin nếu chưa tồn tại — dùng khi khởi động app lần đầu */
  async seedAdminIfNotExists(data: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<void> {
    const exists = await this.existsByEmail(data.email);
    if (!exists) {
      await this.create({ ...data, role: Role.ADMIN });
    }
  }
}
