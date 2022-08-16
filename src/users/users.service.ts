import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
