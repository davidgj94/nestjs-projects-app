import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { AppModule } from 'src/app.module';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { ProjectsService } from 'src/projects/services/projects.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

describe('Projects service', () => {
  let projectsService: ProjectsService;
  let userService: UsersService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    projectsService = moduleRef.get(ProjectsService);
    userService = moduleRef.get(UsersService);
  });

  let project: ProjectEntity;
  let creator: UserEntity;

  beforeEach(async () => {
    creator = await userService.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      role: 'ADMIN',
    });
    project = await projectsService.create(
      {
        description: faker.lorem.paragraph(),
        name: faker.lorem.lines(1),
      },
      creator.id,
    );
  });

  it('creates project', async () => {
    expect(project.createdById).toBe(creator.id);
  });

  it('add members to project', async () => {
    const member1 = await userService.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      role: 'ADMIN',
    });
    const member2 = await userService.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      role: 'ADMIN',
    });
    await projectsService.addParticipant(project.id, member1.id);
    await projectsService.addParticipant(project.id, member2.id);
    project = await projectsService.findByIdOrThrow(project.id);
    expect(project.participantsIds.includes(member1.id)).toBe(true);
    expect(project.participantsIds.includes(member2.id)).toBe(true);
  });

  it('removes members from project', async () => {
    const member1 = await userService.create({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      role: 'ADMIN',
    });

    await projectsService.addParticipant(project.id, member1.id);
    await projectsService.deleteParticipant(project.id, member1.id);
    project = await projectsService.findByIdOrThrow(project.id);
    expect(project.participantsIds).toStrictEqual([]);
  });
});
