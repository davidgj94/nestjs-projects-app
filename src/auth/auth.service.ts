import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Nullable } from 'src/common/types';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateAuthentionDto } from './dtos/create-authentication.dto';
import { AuthenticationProvider } from './providers/auth.provider';
import { AuthenticationRepository } from './repositories/auth.repository';

@Injectable()
export class AuthenticationService {
  constructor(
    private authenticationReposiotry: AuthenticationRepository,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createAuthentionDto: CreateAuthentionDto) {
    return this.authenticationReposiotry.create(createAuthentionDto);
  }

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
