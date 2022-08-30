import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenAccessException } from 'src/auth/exceptions/forbiden-access.exception';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskPageOptionsDto } from '../dto/page-options-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskNotFoundException } from '../exception/task-not-found.exception';
import { ProjectsService } from './projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private userService: UsersService,
    private projectService: ProjectsService,
  ) {}

  async userIsProjectMemberOrThrow(projectId: string, userId: string) {
    const project = await this.projectService.findByIdOrThrow(projectId);
    if (!project.participantsIds.includes(userId))
      throw new ForbiddenAccessException(userId);
  }

  async create(
    createTaskDto: CreateTaskDto,
    createdById: string,
  ): Promise<TaskEntity> {
    await this.userIsProjectMemberOrThrow(createTaskDto.projectId, createdById);

    const task = this.taskRepository.create({ ...createTaskDto, createdById });
    return this.taskRepository.save(task);
  }

  async findByIdOrThrow(taskId: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id: taskId });
    if (!task) throw new TaskNotFoundException(taskId);
    return task;
  }

  async findAll(pageOptionsDto: TaskPageOptionsDto) {
    let queryBuilder = this.taskRepository.createQueryBuilder('entity');

    const pageQueryParams = pageOptionsDto.query;
    if (pageQueryParams)
      Object.keys(pageQueryParams).forEach((key) => {
        queryBuilder = queryBuilder.where(`entity.${key} = :${key}`, {
          [key]: pageQueryParams[key],
        });
      });

    queryBuilder
      .orderBy('entity.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async update(taskId: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findByIdOrThrow(taskId);
    await this.userIsProjectMemberOrThrow(task.projectId, userId);
    return this.taskRepository.save({ ...task, ...updateTaskDto });
  }

  async remove(id: string, userId: string) {
    const task = await this.findByIdOrThrow(id);
    await this.userIsProjectMemberOrThrow(task.projectId, userId);
    return this.taskRepository.remove(task);
  }

  async addAsignee(taskId: string, userId: string) {
    const task = await this.findByIdOrThrow(taskId);
    await this.userIsProjectMemberOrThrow(task.projectId, userId);
    if (!task.asignees.find(({ id }) => id === userId)) {
      const user = await this.userService.findByIdOrThrow(userId);
      task.asignees.push(user);
      await this.taskRepository.save(task);
    }
  }

  async deleteAsignee(taskId: string, userId: string) {
    const task = await this.findByIdOrThrow(taskId);
    await this.userIsProjectMemberOrThrow(task.projectId, userId);
    task.asignees = task.asignees.filter(({ id }) => id !== userId);
    await this.taskRepository.save(task);
  }
}
