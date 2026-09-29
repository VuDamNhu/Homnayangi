import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, UserResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/guards/roles.guard';

/**
 * Controller xử lý các endpoint xác thực
 * Prefix: /api/auth
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Đăng nhập — public, giới hạn 5 request/phút/IP
   * SECURITY: Rate limit chặt hơn global để chống brute force
   */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: UserResponse }> {
    return this.authService.login(dto, res);
  }

  /**
   * Làm mới access token bằng refresh token trong cookie
   */
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @CurrentUser() user: AuthUser & { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: UserResponse }> {
    return this.authService.refresh(user.id, user.refreshToken, res);
  }

  /**
   * Đăng xuất — xoá cookie + xoá refreshTokenHash trong DB
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id, res);
    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Lấy thông tin user đang đăng nhập
   */
  @Get('me')
  getMe(@CurrentUser() user: AuthUser): Promise<UserResponse> {
    return this.authService.getMe(user.id);
  }
}
