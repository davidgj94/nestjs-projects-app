import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserEntity) {
    return user;
  }
}
