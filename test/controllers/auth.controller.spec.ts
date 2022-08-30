import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { useGlobals } from 'src/app.helpers';
import * as faker from 'faker';
import { UsersService } from 'src/users/users.service';
import * as request from 'supertest';

describe('Auth Controller', () => {
  let app: INestApplication;
  const userPassword = faker.internet.password();
  const userEmail = faker.internet.email();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    useGlobals(app);
    await app.init();

    const userService = moduleRef.get<UsersService>(UsersService);
    await userService.create({
      email: userEmail,
      password: userPassword,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      role: 'USER',
    });
  });

  it('allows login if valid email and password', async () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password: userPassword })
      .expect(200);
  });

  it('denies login if not valid email or password', async () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password: faker.internet.password() })
      .expect(401);

    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: faker.internet.email(), password: userPassword })
      .expect(401);
  });
});
