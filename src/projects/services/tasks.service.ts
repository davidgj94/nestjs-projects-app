import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
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

  findAll() {
    return `This action returns all tasks`;
  }

  async update(taskId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findByIdOrThrow(taskId);
    return this.taskRepository.save({ ...task, ...updateTaskDto });
  }

  async remove(id: string) {
    const task = await this.findByIdOrThrow(id);
    return this.taskRepository.remove(task);
  }

  async findByProject(projectId: string): Promise<TaskEntity[]> {
    return this.taskRepository.findBy({ projectId });
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
