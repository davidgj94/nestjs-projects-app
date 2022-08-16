import { Injectable } from '@nestjs/common';
import { Nullable } from 'src/common/types';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthenticationProvider } from './providers/auth.provider';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Nullable<UserEntity>> {
    const user = await this.userService.findByEmail(email);
    if (user)
      return (await AuthenticationProvider.generateHash(password)) ===
        user.authentication.password
        ? user
        : null;
  }
}
