import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectsRepository: Repository<ProjectEntity>,
    private userService: UsersService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    createdBy: string,
  ): Promise<ProjectEntity> {
    const user = await this.userService.findByIdOrThrow(createdBy);
    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdBy: user,
    });
    await this.projectsRepository.save(project);
    return project;
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
