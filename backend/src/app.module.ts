import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Validate biến môi trường khi khởi động — app sẽ không chạy nếu thiếu
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(4000),
        MONGODB_URI: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        // SECURITY: Secret phải đủ dài để chống brute force
        JWT_ACCESS_SECRET: Joi.string().min(32).required(),
        JWT_REFRESH_SECRET: Joi.string().min(32).required(),
        JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES: Joi.string().default('7d'),
        // Tài khoản admin mặc định (seed khi khởi động)
        ADMIN_EMAIL: Joi.string().email().default('admin@homnayangi.vn'),
        ADMIN_PASSWORD: Joi.string().min(6).default('Admin@123'),
        ADMIN_NAME: Joi.string().default('Admin'),
      }),
    }),

    // Kết nối MongoDB Atlas qua URI từ env
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // SECURITY: Giới hạn 100 request / 60 giây / IP (global)
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    AuthModule,
    UsersModule,
  ],
  providers: [
    // Áp dụng guard toàn cục — mọi route đều cần đăng nhập trừ @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
