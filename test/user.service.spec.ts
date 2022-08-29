import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { AppModule } from 'src/app.module';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserNotFoundException } from 'src/users/exceptions/user-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { v4 as uuid } from 'uuid';

describe('Users service', () => {
  let service: UsersService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  let createUserDto: CreateUserDto;
  let user: UserEntity;

  beforeEach(async () => {
    createUserDto = {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      role: 'ADMIN',
    };
    user = await service.create(createUserDto);
  });

  it('creates user and hashses password', async () => {
    expect(user.email).toBe(createUserDto.email);
    expect(user.authentication.password).not.toBe(createUserDto.password);
    expect(user.authentication.role).toBe(createUserDto.role);
  });

  it('throws exception if user not found', async () => {
    const userId = uuid();
    await expect(service.findByIdOrThrow(userId)).rejects.toThrow(
      new UserNotFoundException(userId),
    );
  });

  it('finds user if exists', async () => {
    const foundUser = await service.findByIdOrThrow(user.id);
    expect(user).toStrictEqual(foundUser);
  });
});
