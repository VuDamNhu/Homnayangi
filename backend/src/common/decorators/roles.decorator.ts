import { SetMetadata } from '@nestjs/common';

/** Các role hợp lệ trong hệ thống */
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export const ROLES_KEY = 'roles';

/** Đánh dấu route chỉ cho phép role cụ thể */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
