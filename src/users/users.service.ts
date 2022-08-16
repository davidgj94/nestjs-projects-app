import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthenticationService))
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

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
