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
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { ProjectDto } from '../dto/project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/users/dtos/user.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@RequiredRole('ADMIN')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Create project
   */
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @User() { id: createdBy }: JwtUser,
  ): Promise<ProjectDto> {
    return this.projectsService
      .create(createProjectDto, createdBy)
      .then(ProjectDto.fromEntity);
  }

  /**
   * Update project
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService
      .update(id, updateProjectDto)
      .then(ProjectDto.fromEntity);
  }

  /**
   * Get all projects
   */
  @Get()
  @RequiredRole('USER')
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.projectsService.findAll(pageOptionsDto);
  }

  /**
   * Get project by id
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectDto> {
    return this.projectsService.findByIdOrThrow(id).then(ProjectDto.fromEntity);
  }

  /**
   * Delete project
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectDto> {
    return this.projectsService.remove(id).then(ProjectDto.fromEntity);
  }

  /**
   * Add participants
   */
  @Put(':projectId/participants/:userId')
  addParticipant(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.projectsService.addParticipant(projectId, userId);
  }

  /**
   * Delete participant
   */
  @Delete(':projectId/participants/:userId')
  removeParticipant(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.projectsService.deleteParticipant(projectId, userId);
  }

  /**
   * Get all projects participants
   */
  @Get(':id/participants')
  @RequiredRole('USER')
  async findProjectParcipants(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserDto[]> {
    const users = (await this.projectsService.findByIdOrThrow(id)).participants;
    return users.map(UserDto.fromEntity);
  }
}
