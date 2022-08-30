import { ForbiddenException } from '@nestjs/common';

export class ForbiddenAccessException extends ForbiddenException {
  constructor(userId: string) {
    super(`User with id ${userId} is not allowed to perform action`);
  }
}
