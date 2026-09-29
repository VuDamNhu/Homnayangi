import { Role } from '../../../common/decorators/roles.decorator';

/** Payload lưu trong JWT */
export interface JwtPayload {
  sub: string;    // userId
  role: Role;
  tokenVersion: number;
}
