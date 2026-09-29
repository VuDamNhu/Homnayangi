import { SetMetadata } from '@nestjs/common';

/** Đánh dấu route là công khai — không cần đăng nhập */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
