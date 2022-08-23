import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectNotFoundException } from './exception/project-not-found.exception';

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
    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdById: createdBy,
    });
    await this.projectsRepository.save(project);
    return project;
  }

  async findAll() {
    return this.projectsRepository.find();
  }

  async findByIdOrThrow(projectId: string): Promise<ProjectEntity> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });
    if (!project) throw new ProjectNotFoundException(projectId);
    return project;
  }

  async addParticipant(
    projectId: string,
    userId: string,
  ): Promise<ProjectEntity> {
    const project = await this.findByIdOrThrow(projectId);
    if (!project.participantsIds.includes(userId)) {
      const user = await this.userService.findByIdOrThrow(userId);
      project.participants.push(user);
      await this.projectsRepository.save(project);
    }
    return project;
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
