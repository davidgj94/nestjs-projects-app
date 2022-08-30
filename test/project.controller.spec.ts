import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { AppModule } from 'src/app.module';
import { JwtUser } from 'src/auth/types';
import { useGlobals } from 'src/main';
import { ProjectDto } from 'src/projects/dto/project.dto';
import { ProjectsService } from 'src/projects/services/projects.service';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Project Controller', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  let adminToken: string;
  let userToken: string;
  let rootToken: string;

  const projectService = {
    create: (): ProjectDto => ({
      isDto: true,
      id: uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      createdById: uuid(),
      description: faker.lorem.paragraph(),
      name: faker.lorem.words(),
    }),
    findAll: (): ProjectDto[] => [
      {
        isDto: true,
        id: uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        createdById: uuid(),
        description: faker.lorem.paragraph(),
        name: faker.lorem.words(),
      },
      {
        isDto: true,
        id: uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        createdById: uuid(),
        description: faker.lorem.paragraph(),
        name: faker.lorem.words(),
      },
    ],
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProjectsService)
      .useValue(projectService)
      .compile();
    jwtService = moduleRef.get(JwtService);
    app = moduleRef.createNestApplication();
    useGlobals(app);
    await app.init();

    adminToken = await jwtService.signAsync({
      id: uuid(),
      role: 'ADMIN',
    } as JwtUser);

    userToken = await jwtService.signAsync({
      id: uuid(),
      role: 'USER',
    } as JwtUser);

    rootToken = await jwtService.signAsync({
      id: uuid(),
      role: 'ROOT',
    } as JwtUser);
  });

  it('returns 403 in all project endpoints but getAll with USER token', async () => {
    const result = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', 'bearer ' + adminToken);
    console.log(result);
  });
});
