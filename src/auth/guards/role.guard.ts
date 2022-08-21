import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { ROLE_KEY } from '../decorators/role.decorator';
import { JwtUser } from '../types';
import { Roles } from '../types/roles.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const requiredRole = this.reflector.getAllAndOverride<Roles | undefined>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRole) return true;
    const { user } = context.switchToHttp().getRequest();
    return (
      Roles.findIndex((el) => el === requiredRole) >
      Roles.findIndex((el) => el === (user as JwtUser).role)
    );
  }
}
