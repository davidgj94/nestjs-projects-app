import { Module } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { UsersModule } from 'src/users/users.module';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { TaskEntity } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, TaskEntity]), UsersModule],
  controllers: [ProjectsController, TasksController],
  providers: [ProjectsService, TasksService],
})
export class ProjectsModule {}
