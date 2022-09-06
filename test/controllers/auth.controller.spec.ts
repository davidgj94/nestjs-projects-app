import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';
import * as request from 'supertest';
import { AuthController } from 'src/auth/auth.controller';
import { bootstrapControllerTest } from './utils';
import { AuthenticationService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { Roles } from 'src/auth/types/roles.type';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';

describe('Auth Controller', () => {
  let app: INestApplication;

  let userAuth;
  let userToken: string;
  const authService = {
    validateUser: (email: string, password: string) => {
      if (userAuth.email === email && userAuth.password === password)
        return userAuth;
    },
    login: () => ({
      access_token: userToken,
    }),
  };

  beforeAll(async () => {
    app = await bootstrapControllerTest(
      AuthController,
      [{ provide: AuthenticationService, useValue: authService }],
      [LocalStrategy],
    );

    const jwtService = app.get(JwtService);
    userAuth = {
      id: uuid(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      role: 'USER' as Roles,
    };
    userToken = await jwtService.signAsync({
      id: userAuth.id,
      role: userAuth.role,
    });
  });

  it('allows login if valid email and password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userAuth.email, password: userAuth.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ access_token: userToken });
  });

  it('denies login if not valid email or password', async () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userAuth.email, password: faker.internet.password() })
      .expect(401);

    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: faker.internet.email(), password: userAuth.password })
      .expect(401);
  });
});
