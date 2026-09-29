import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

/** Payload được gắn vào request.user sau khi JWT verify */
export interface AuthUser {
  id: string;
  role: Role;
}

/**
 * Guard kiểm tra role sau khi đã xác thực JWT
 * Route không có @Roles() → cho phép mọi user đã đăng nhập
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Không yêu cầu role cụ thể → cho qua
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user: AuthUser }>();
    const hasRole = requiredRoles.includes(user?.role);

    if (!hasRole) throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    return true;
  }
}
