import { Roles } from './roles.type';

export interface JwtUser {
  id: string;
  role: Roles;
}
