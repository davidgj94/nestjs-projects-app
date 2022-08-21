import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtUser } from 'src/auth/types';
import { User } from 'src/common/decorators';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@User() { id: userId }: JwtUser): Promise<UserEntity> {
    return await this.usersService.findByIdOrThrow(userId);
  }

  @Get(':id')
  async find(@Param('id', ParseUUIDPipe) userId: string): Promise<UserEntity> {
    return await this.usersService.findByIdOrThrow(userId);
  }
}
