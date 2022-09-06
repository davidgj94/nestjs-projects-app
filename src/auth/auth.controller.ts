import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators';
import { AuthenticationService } from './auth.service';
import { Public } from './decorators/is-public.decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthenticationEntity } from './entities';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  async login(@User() userAuth: AuthenticationEntity) {
    return this.authService.login(userAuth);
  }
}
