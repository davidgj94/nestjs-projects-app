import { NestFactory } from '@nestjs/core';
import { ProjectsService } from 'src/projects/services/projects.service';
import { TasksService } from 'src/projects/services/tasks.service';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as faker from 'faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  const projectService = app.get(ProjectsService);
  const taskService = app.get(TasksService);

  const admin = await userService.create({
    email: 'admin@gmail.com',
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    password: 'password',
    role: 'ADMIN',
  });

  const [project1, project2] = await Promise.all([
    projectService.create(
      {
        description: faker.lorem.paragraph(),
        name: faker.lorem.sentence(),
      },
      admin.id,
    ),
    projectService.create(
      {
        description: faker.lorem.paragraph(),
        name: faker.lorem.sentence(),
      },
      admin.id,
    ),
  ]);

  await Promise.all(
    Array(5)
      .fill(null)
      .map(() =>
        taskService.create(
          {
            description: faker.lorem.paragraph(),
            name: faker.lorem.sentence(),
            projectId: project1.id,
          },
          admin.id,
        ),
      ),
  );

  await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        taskService.create(
          {
            description: faker.lorem.paragraph(),
            name: faker.lorem.sentence(),
            projectId: project2.id,
          },
          admin.id,
        ),
      ),
  );

  await Promise.all([
    userService.create({
      email: 'user1@gmail.com',
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      password: 'password',
      role: 'USER',
    }),
    userService.create({
      email: 'user2@gmail.com',
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      password: 'password',
      role: 'USER',
    }),
    userService.create({
      email: 'user3@gmail.com',
      firstName: faker.name.findName(),
      lastName: faker.name.lastName(),
      password: 'password',
      role: 'USER',
    }),
  ]);

  console.log('Seeding done!');
}

bootstrap();
