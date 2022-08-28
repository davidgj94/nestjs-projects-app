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
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtUser } from 'src/auth/types';
import { User } from 'src/common/decorators';
import { RequiredRole } from 'src/auth/decorators/role.decorator';
import { Public } from 'src/auth/decorators/is-public.decorator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { ProjectDto } from '../dto/project.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
@RequiredRole('ADMIN')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @User() { id: createdBy }: JwtUser,
  ): Promise<ProjectDto> {
    return this.projectsService
      .create(createProjectDto, createdBy)
      .then(ProjectDto.fromEntity);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService
      .update(id, updateProjectDto)
      .then(ProjectDto.fromEntity);
  }

  @Get()
  @Public()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.projectsService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectDto> {
    return this.projectsService.findByIdOrThrow(id).then(ProjectDto.fromEntity);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectDto> {
    return this.projectsService.remove(id).then(ProjectDto.fromEntity);
  }

  @Put(':projectId/participants/:userId')
  addParticipant(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.projectsService.addParticipant(projectId, userId);
  }

  @Delete(':projectId/participants/:userId')
  removeParticipant(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.projectsService.deleteParticipant(projectId, userId);
  }

  @Get(':id/participants')
  @RequiredRole('USER')
  async findProjectParcipants(@Param('id', ParseUUIDPipe) id: string) {
    return (await this.projectsService.findByIdOrThrow(id)).participants;
  }
}
