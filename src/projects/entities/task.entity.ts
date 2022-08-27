import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity()
export class TaskEntity extends AbstractEntity {
  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToOne(() => UserEntity, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'createdById' })
  @Exclude()
  public createdBy: UserEntity;

  @Column()
  public createdById: string;

  @ManyToOne(() => ProjectEntity, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'projectId' })
  @Exclude()
  public project: ProjectEntity;

  @Column()
  public projectId: string;

  @ManyToMany(() => UserEntity, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinTable()
  @Exclude()
  public asignees: UserEntity[];

  @RelationId((task: TaskEntity) => task.asignees)
  public asigneesIds: string[];
}
