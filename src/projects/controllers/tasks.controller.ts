import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { RequiredRole } from 'src/auth/decorators/role.decorator';
import { User } from 'src/common/decorators';
import { JwtUser } from 'src/auth/types';

@Controller('tasks')
@RequiredRole('USER')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @User() { id: userId }: JwtUser,
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findByIdOrThrow(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Put(':taskId/asignees/:userId')
  addAsignee(
    @Param('taskId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.tasksService.addAsignee(projectId, userId);
  }

  @Delete(':taskId/asignees/:userId')
  removeAsignee(
    @Param('taskId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.tasksService.deleteAsignee(projectId, userId);
  }

  @Get(':id/asignees')
  async findTaskAsignees(@Param('id', ParseUUIDPipe) id: string) {
    return (await this.tasksService.findByIdOrThrow(id)).asignees;
  }
}
