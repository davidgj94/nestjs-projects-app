import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async find(@Param('id') userId: string): Promise<UserEntity> {
    return await this.usersService.findByIdOrThrow(userId);
  }
}
