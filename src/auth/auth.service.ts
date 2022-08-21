import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from 'src/common/types';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAuthentionDto } from './dtos/create-authentication.dto';
import { AuthenticationEntity } from './entities';
import { JwtUser } from './types';
import { AuthenticationProvider } from './providers/auth.provider';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AuthenticationEntity)
    private authenticationReposiotry: Repository<AuthenticationEntity>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthentionDto: CreateAuthentionDto) {
    return this.authenticationReposiotry.create(createAuthentionDto);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Nullable<UserEntity>> {
    const user = await this.userService.findByEmail(email);
    console.log(user);
    if (user) {
      return (await AuthenticationProvider.compareHash(
        password,
        user.authentication.password,
      ))
        ? user
        : null;
    }
  }

  async login(user: UserEntity) {
    const payload: JwtUser = { id: user.id, email: user.email };
    return { acces_token: await this.jwtService.signAsync(payload) };
  }
}
