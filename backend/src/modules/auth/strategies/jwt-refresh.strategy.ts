import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { UsersRepository } from '../../users/users.repository';
import { AuthUser } from '../../../common/guards/roles.guard';

/**
 * Strategy xác thực refresh token lấy từ cookie httpOnly
 * Dùng cho endpoint POST /auth/refresh
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private readonly usersRepo: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
  }

  /**
   * Trả về { user, refreshToken } để AuthService so sánh với hash trong DB
   */
  async validate(req: Request, payload: JwtPayload): Promise<AuthUser & { refreshToken: string }> {
    const user = await this.usersRepo.findById(payload.sub);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }
    const refreshToken = req.cookies?.refresh_token as string;
    return { id: payload.sub, role: payload.role, refreshToken };
  }
}
