import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractDto } from 'src/common/dtos';
import { TaskEntity } from '../entities/task.entity';

export class TaskDto
  extends AbstractDto
  implements
    Pick<TaskEntity, 'name' | 'description' | 'createdById' | 'projectId'>
{
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ format: 'uuid' })
  public createdById: string;

  @ApiProperty({ format: 'uuid' })
  public projectId: string;

  constructor(task: TaskEntity) {
    super(task);
    const { name, description, createdBy, projectId } = task;
    Object.assign(this, { name, description, createdBy, projectId });
  }

  static fromEntity(task: TaskEntity) {
    return new TaskDto(task);
  }
}
