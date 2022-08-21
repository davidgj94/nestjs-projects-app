import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators';
import { AuthenticationService } from './auth.service';
import { AuthenticationEntity } from './entities';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@User() userAuth: AuthenticationEntity) {
    return this.authService.login(userAuth);
  }
}
