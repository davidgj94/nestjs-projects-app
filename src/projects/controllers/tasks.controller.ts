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
  Query,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { RequiredRole } from 'src/auth/decorators/role.decorator';
import { User } from 'src/common/decorators';
import { JwtUser } from 'src/auth/types';
import { TaskPageOptionsDto } from '../dto/page-options-task.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TaskDto } from '../dto/task.dto';

@ApiTags('Tasks')
@Controller('tasks')
@RequiredRole('USER')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({
    type: TaskDto,
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @User() { id: userId }: JwtUser,
  ): Promise<TaskDto> {
    return this.tasksService
      .create(createTaskDto, userId)
      .then(TaskDto.fromEntity);
  }

  @Get()
  findAll(@Query() pageOptionsDto: TaskPageOptionsDto) {
    return this.tasksService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TaskDto> {
    return this.tasksService.findByIdOrThrow(id).then(TaskDto.fromEntity);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDto> {
    return this.tasksService.update(id, updateTaskDto).then(TaskDto.fromEntity);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<TaskDto> {
    return this.tasksService.remove(id).then(TaskDto.fromEntity);
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