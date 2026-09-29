import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

/**
 * Khởi động ứng dụng NestJS
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // SECURITY: Thêm các HTTP header bảo mật
  app.use(helmet());
  // Đọc cookie để lấy JWT
  app.use(cookieParser());

  // SECURITY: Chỉ cho phép domain frontend gọi API, cho phép gửi cookie
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Validate toàn cục: loại bỏ field lạ, chặn request có field không khai báo
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Chuẩn hoá response lỗi và thành công
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 API đang chạy tại cổng ${port}`, 'Bootstrap');
}
bootstrap();
