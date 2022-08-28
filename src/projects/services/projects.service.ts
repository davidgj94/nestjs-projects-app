import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectNotFoundException } from '../exception/project-not-found.exception';

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
    return await this.projectsRepository.save(project);
  }

  async update(
    projectId: string,
    updates: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const project = await this.findByIdOrThrow(projectId);
    return this.projectsRepository.save({
      ...project,
      updates,
    });
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.projectsRepository.createQueryBuilder('entity');

    queryBuilder
      .orderBy('entity.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findByIdOrThrow(projectId: string): Promise<ProjectEntity> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });
    if (!project) throw new ProjectNotFoundException(projectId);
    return project;
  }

  async remove(projectId: string): Promise<ProjectEntity> {
    const project = await this.findByIdOrThrow(projectId);
    return this.projectsRepository.remove(project);
  }

  async addParticipant(projectId: string, userId: string) {
    const project = await this.findByIdOrThrow(projectId);
    if (!project.participantsIds.includes(userId)) {
      const user = await this.userService.findByIdOrThrow(userId);
      project.participants.push(user);
      await this.projectsRepository.save(project);
    }
  }

  async deleteParticipant(projectId: string, userId: string) {
    const project = await this.findByIdOrThrow(projectId);
    project.participants = project.participants.filter(
      ({ id }) => id !== userId,
    );
    this.projectsRepository.save(project);
  }
}
