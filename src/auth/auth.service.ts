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
    private jwtService: JwtService,
  ) {}

  async create(createAuthentionDto: CreateAuthentionDto) {
    return this.authenticationReposiotry.create(createAuthentionDto);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Nullable<AuthenticationEntity>> {
    const userAuth = await this.authenticationReposiotry.findOne({
      where: { email },
      relations: ['user'],
    });

    if (userAuth) {
      return (await AuthenticationProvider.compareHash(
        password,
        userAuth.password,
      ))
        ? userAuth
        : null;
    }
  }

  async login(userAuth: AuthenticationEntity) {
    const payload: JwtUser = { id: userAuth.user.id, role: userAuth.role };
    return {
      acces_token: await this.jwtService.signAsync(payload),
    };
  }
}
