import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Bắt toàn bộ lỗi và trả về định dạng thống nhất
 * SECURITY: Không trả stack trace ra client ở môi trường production
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Lấy message từ HttpException (có thể là object từ class-validator)
    let message: string | string[] = 'Lỗi hệ thống, vui lòng thử lại sau';
    if (isHttp) {
      const response = exception.getResponse();
      message =
        typeof response === 'object' && 'message' in response
          ? (response as { message: string | string[] }).message
          : exception.message;
    }

    // Ghi log lỗi 500 để debug, không gửi chi tiết cho client
    if (!isHttp) this.logger.error(exception);

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
