import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskPageOptionsDto } from '../dto/page-options-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { TaskNotFoundException } from '../exception/task-not-found.exception';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private userService: UsersService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    createdById: string,
  ): Promise<TaskEntity> {
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

  async update(taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findByIdOrThrow(taskId);
    return this.taskRepository.save({ ...task, ...updateTaskDto });
  }

  async remove(id: string) {
    const task = await this.findByIdOrThrow(id);
    return this.taskRepository.remove(task);
  }

  async addAsignee(taskId: string, userId: string) {
    const task = await this.findByIdOrThrow(taskId);
    if (!task.asignees.find(({ id }) => id === userId)) {
      const user = await this.userService.findByIdOrThrow(userId);
      task.asignees.push(user);
      await this.taskRepository.save(task);
    }
  }

  async deleteAsignee(taskId: string, userId: string) {
    const task = await this.findByIdOrThrow(taskId);
    task.asignees = task.asignees.filter(({ id }) => id !== userId);
    await this.taskRepository.save(task);
  }
}
