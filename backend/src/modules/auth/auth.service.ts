import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Response, CookieOptions } from 'express';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { UserDocument } from '../users/schemas/user.schema';
import { Role } from '../../common/decorators/roles.decorator';

/** Thông tin user trả về client (không có password) */
export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

/** Type dùng chung cho cả UserDocument và lean User */
type UserLike = { id?: string; _id?: unknown; email: string; fullName: string; role: Role; tokenVersion: number };

/** Kết quả sau khi xác thực thành công */
interface AuthResult {
  user: UserResponse;
}

/**
 * Tạo cookie options chuẩn theo môi trường
 * SECURITY: httpOnly + secure + sameSite để chống XSS & CSRF
 */
function cookieOptions(maxAgeMs: number, path = '/'): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path,
    maxAge: maxAgeMs,
  };
}

/**
 * Service xử lý xác thực người dùng
 */
@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_TIME_MS = 15 * 60 * 1000; // 15 phút

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Seed tài khoản admin mặc định khi khởi động lần đầu
   * Chỉ tạo nếu chưa tồn tại
   */
  async onModuleInit(): Promise<void> {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL') ?? 'admin@homnayangi.vn';
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD') ?? 'Admin@123';
    const adminName = this.config.get<string>('ADMIN_NAME') ?? 'Admin';

    const hashedPassword = await argon2.hash(adminPassword);
    await this.usersRepo.seedAdminIfNotExists({
      email: adminEmail,
      password: hashedPassword,
      fullName: adminName,
    });
    this.logger.log(`Admin seed check done — email: ${adminEmail}`);
  }

  /**
   * Đăng nhập và set cookie
   * SECURITY: Thông báo lỗi chung chung để không lộ email có tồn tại hay không
   */
  async login(dto: LoginDto, res: Response): Promise<AuthResult> {
    const user = await this.usersRepo.findByEmailWithPassword(dto.email);
    const invalidError = new UnauthorizedException('Email hoặc mật khẩu không đúng');

    if (!user) throw invalidError;

    // Kiểm tra tài khoản có bị khoá tạm không
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new ForbiddenException('Tài khoản tạm khoá, vui lòng thử lại sau 15 phút');
    }

    // So sánh mật khẩu
    const isMatch = await argon2.verify(user.password, dto.password);
    if (!isMatch) {
      await this.usersRepo.incrementFailedAttempts(
        user.id as string,
        this.MAX_FAILED_ATTEMPTS,
        this.LOCK_TIME_MS,
      );
      throw invalidError;
    }

    await this.usersRepo.resetLoginAttempts(user.id as string);
    return this.issueTokensAndSetCookies(user, res);
  }

  /**
   * Làm mới cặp token (Refresh Token Rotation)
   * SECURITY: Nếu refresh token không khớp DB → thu hồi tất cả session
   */
  async refresh(userId: string, refreshToken: string, res: Response): Promise<AuthResult> {
    const user = await this.usersRepo.findByIdWithRefreshHash(userId);
    if (!user?.refreshTokenHash) throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');

    const isValid = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!isValid) {
      // Thu hồi tất cả — có thể token bị đánh cắp
      await this.usersRepo.revokeAllSessions(user.id as string);
      throw new UnauthorizedException('Phát hiện phiên bất thường, vui lòng đăng nhập lại');
    }

    return this.issueTokensAndSetCookies(user, res);
  }

  /**
   * Đăng xuất: xoá hash trong DB + xoá 2 cookie
   */
  async logout(userId: string, res: Response): Promise<void> {
    await this.usersRepo.updateRefreshTokenHash(userId, null);
    res.clearCookie('access_token', cookieOptions(0));
    res.clearCookie('refresh_token', cookieOptions(0, '/api/auth'));
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new UnauthorizedException('Không tìm thấy người dùng');
    return this.toUserResponse(user);
  }

  /**
   * Tạo cặp token mới, lưu hash refresh token, set cookie
   */
  private async issueTokensAndSetCookies(
    user: UserDocument,
    res: Response,
  ): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.id as string,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessExpiresMs = this.parseDurationMs(
      this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m',
    );
    const refreshExpiresMs = this.parseDurationMs(
      this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m',
        algorithm: 'HS256',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d',
        algorithm: 'HS256',
      }),
    ]);

    // SECURITY: Chỉ lưu hash, nếu DB bị lộ kẻ tấn công cũng không dùng được token
    await this.usersRepo.updateRefreshTokenHash(user.id as string, await argon2.hash(refreshToken));

    // Set cookie httpOnly — JS phía client không đọc được
    res.cookie('access_token', accessToken, cookieOptions(accessExpiresMs));
    res.cookie('refresh_token', refreshToken, cookieOptions(refreshExpiresMs, '/api/auth'));

    return { user: this.toUserResponse(user) };
  }

  /** Chuyển UserDocument → UserResponse (loại bỏ field nhạy cảm) */
  private toUserResponse(user: UserLike): UserResponse {
    return {
      id: (user.id ?? String(user._id)) as string,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  /**
   * Chuyển chuỗi thời gian (15m, 7d) sang milliseconds
   */
  private parseDurationMs(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 15 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return value * (multipliers[unit] ?? 60_000);
  }
}
