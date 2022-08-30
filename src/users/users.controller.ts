import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/is-public.decorator';
import { RequiredRole } from 'src/auth/decorators/role.decorator';
import { JwtUser } from 'src/auth/types';
import { User } from 'src/common/decorators';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@RequiredRole('USER')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto).then(UserDto.fromEntity);
  }

  @Get('me')
  me(@User() { id: userId }: JwtUser): Promise<UserDto> {
    return this.usersService.findByIdOrThrow(userId).then(UserDto.fromEntity);
  }

  @Get(':id')
  find(@Param('id', ParseUUIDPipe) userId: string): Promise<UserDto> {
    return this.usersService.findByIdOrThrow(userId).then(UserDto.fromEntity);
  }
}
