import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from 'src/common/types';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { QueryRunner, Repository } from 'typeorm';
import { CreateAuthentionDto } from './dtos/create-authentication.dto';
import { AuthenticationEntity } from './entities';
import { AuthenticationProvider } from './providers/auth.provider';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private authenticationReposiotry: Repository<AuthenticationEntity>,
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
