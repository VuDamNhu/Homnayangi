import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { UsersRepository } from '../../users/users.repository';
import { AuthUser } from '../../../common/guards/roles.guard';

/**
 * Strategy xác thực access token lấy từ cookie httpOnly
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly usersRepo: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
      algorithms: ['HS256'], // SECURITY: Cố định thuật toán, chặn tấn công alg:none
    });
  }

  /**
   * Chạy sau khi verify chữ ký thành công
   * Kiểm tra tokenVersion để hỗ trợ thu hồi token tức thì
   */
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersRepo.findById(payload.sub);
    if (!user || user.deletedAt || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }
    return { id: payload.sub, role: payload.role };
  }
}
