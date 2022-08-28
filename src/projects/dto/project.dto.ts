import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractDto } from 'src/common/dtos';
import { ProjectEntity } from '../entities/project.entity';

export class ProjectDto
  extends AbstractDto
  implements Pick<ProjectEntity, 'name' | 'description' | 'createdById'>
{
  @ApiProperty({ format: 'uuid' })
  public createdById: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;

  constructor(project: ProjectEntity) {
    super(project);
    const { createdById, name, description } = project;
    Object.assign(this, { createdById, name, description });
  }

  static fromEntity(project: ProjectEntity) {
    return new ProjectDto(project);
  }
}
