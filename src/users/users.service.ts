import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthenticationService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    @Inject(forwardRef(() => AuthenticationService))
    private authenticationService: AuthenticationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const authentication = await this.authenticationService.create(
      createUserDto,
    );
    return this.userRepository.create({ ...createUserDto, authentication });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
