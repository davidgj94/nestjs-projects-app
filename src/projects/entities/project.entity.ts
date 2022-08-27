import { Exclude, Transform } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities';
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
export class ProjectEntity extends AbstractEntity {
  @Column({ unique: true })
  public name: string;

  @Column()
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

  @ManyToMany(() => UserEntity, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinTable()
  @Exclude()
  public participants: UserEntity[];

  @RelationId((project: ProjectEntity) => project.participants)
  public participantsIds: string[];
}
