import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as faker from 'faker';
import { AppModule } from 'src/app.module';
import { JwtUser } from 'src/auth/types';
import { useGlobals } from 'src/app.helpers';
import { ProjectsService } from 'src/projects/services/projects.service';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PageDto } from 'src/common/dtos/page.dto';
import { UpdateProjectDto } from 'src/projects/dto/update-project.dto';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';

describe('Project Controller', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  let adminToken: string;
  let userToken: string;
  let rootToken: string;

  let projectEntityStub: ProjectEntity;
  const projectService = {
    create: async () => projectEntityStub,
    findAll: async (): Promise<PageDto<ProjectEntity>> => ({
      data: [projectEntityStub],
      meta: {
        hasNextPage: false,
        hasPreviousPage: false,
        itemCount: 1,
        page: 0,
        pageCount: 1,
        take: 1,
      },
    }),
    findByIdOrThrow: async () => projectEntityStub,
    update: async () => projectEntityStub,
    remove: async () => projectEntityStub,
    addParticipant: async () => undefined,
    deleteParticipant: async () => undefined,
  };

  const createProjectDto: CreateProjectDto = {
    description: faker.lorem.paragraph(),
    name: faker.lorem.words(),
  };
  const updaProjectDto: UpdateProjectDto = {
    description: faker.lorem.paragraph(),
    name: faker.lorem.words(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProjectsService)
      .useValue(projectService)
      .compile();

    app = moduleRef.createNestApplication();
    useGlobals(app);
    await app.init();

    jwtService = moduleRef.get(JwtService);
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

    const projectRepository = moduleRef.get<Repository<ProjectEntity>>(
      getRepositoryToken(ProjectEntity),
    );

    projectEntityStub = projectRepository.create({
      id: uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      createdById: uuid(),
      description: faker.lorem.paragraph(),
      name: faker.lorem.words(),
    });
  });

  beforeAll(async () => {
    await app.close();
  });

  it('returns 403 in all project endpoints but get/getAll with USER token', async () => {
    const _req = request(app.getHttpServer());
    await Promise.all([
      _req
        .patch(`/projects/${uuid()}`)
        .send(updaProjectDto)
        .set('Authorization', 'bearer ' + userToken)
        .expect(403),
      _req
        .post('/projects')
        .send(createProjectDto)
        .set('Authorization', 'bearer ' + userToken)
        .expect(403),
      _req
        .delete(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + userToken)
        .expect(403),
      _req
        .get(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + userToken)
        .expect(200),
      _req
        .get('/projects')
        .set('Authorization', 'bearer ' + userToken)
        .expect(200),
    ]);
  });

  it('accepts all projects endpoints with ADMIN  adn ROOT tokens', async () => {
    const _req = request(app.getHttpServer());
    await Promise.all([
      _req
        .patch(`/projects/${uuid()}`)
        .send(updaProjectDto)
        .set('Authorization', 'bearer ' + adminToken)
        .expect(200),
      _req
        .post('/projects')
        .send(createProjectDto)
        .set('Authorization', 'bearer ' + adminToken)
        .expect(201),
      _req
        .delete(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + adminToken)
        .expect(200),
      _req
        .get(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + adminToken)
        .expect(200),
      _req
        .get('/projects')
        .set('Authorization', 'bearer ' + adminToken)
        .expect(200),
    ]);

    await Promise.all([
      _req
        .patch(`/projects/${uuid()}`)
        .send(updaProjectDto)
        .set('Authorization', 'bearer ' + rootToken)
        .expect(200),
      _req
        .post('/projects')
        .send(createProjectDto)
        .set('Authorization', 'bearer ' + rootToken)
        .expect(201),
      _req
        .delete(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + rootToken)
        .expect(200),
      _req
        .get(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + rootToken)
        .expect(200),
      _req
        .get('/projects')
        .set('Authorization', 'bearer ' + rootToken)
        .expect(200),
    ]);
  });

  it('rejects request if validation fail', async () => {
    const _req = request(app.getHttpServer());
    // empty payload
    await Promise.all([
      _req
        .patch(`/projects/${uuid()}`)
        .set('Authorization', 'bearer ' + adminToken)
        .expect(400),
      _req
        .post('/projects')
        .set('Authorization', 'bearer ' + adminToken)
        .expect(400),
    ]);
  });
});
