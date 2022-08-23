import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtUser } from 'src/auth/types';
import { User } from 'src/common/decorators';
import { RequiredRole } from 'src/auth/decorators/role.decorator';
import { Public } from 'src/auth/decorators/is-public.decorator';

@Controller('projects')
@RequiredRole('ADMIN')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @User() { id: createdBy }: JwtUser,
  ) {
    return await this.projectsService.create(createProjectDto, createdBy);
  }

  @Get()
  @Public()
  findAll() {
    return this.projectsService.findAll();
  }

  @Post(':projectId/participants/:userId')
  @Public()
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.projectsService.addParticipant(projectId, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
