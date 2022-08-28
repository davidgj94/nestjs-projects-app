import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { Nullable } from 'src/common/types';

interface TaskQuery {
  projectId?: string;
}

export class TaskPageOptionsDto extends PageOptionsDto implements TaskQuery {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ format: 'uuid' })
  projectId?: string;

  get query(): Nullable<TaskQuery> {
    if (this.projectId) return { projectId: this.projectId };
  }
}
