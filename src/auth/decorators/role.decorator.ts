import { SetMetadata } from '@nestjs/common';
import { Roles } from '../types/roles.type';

export const ROLE_KEY = 'role';
export const RequiredRole = (role: Roles) => SetMetadata(ROLE_KEY, role);
