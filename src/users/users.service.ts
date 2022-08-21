import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authenticationService: AuthenticationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const authentication = await this.authenticationService.create(
      createUserDto,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      authentication,
    });
    await this.userRepository.save(user);
    return user;
  }

  async findByIdOrThrow(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) return user;
    throw new UserNotFoundException(userId);
  }
}
