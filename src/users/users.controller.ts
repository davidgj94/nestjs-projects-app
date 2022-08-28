import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RequiredRole } from 'src/auth/decorators/role.decorator';
import { JwtUser } from 'src/auth/types';
import { User } from 'src/common/decorators';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@RequiredRole('USER')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@User() { id: userId }: JwtUser): Promise<UserDto> {
    return this.usersService.findByIdOrThrow(userId).then(UserDto.fromEntity);
  }

  @Get(':id')
  async find(@Param('id', ParseUUIDPipe) userId: string): Promise<UserDto> {
    return this.usersService.findByIdOrThrow(userId).then(UserDto.fromEntity);
  }
}
