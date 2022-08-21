import { AbstractEntity } from 'src/common/entities';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class ProjectEntity extends AbstractEntity {
  @Column({ unique: true })
  public name: string;

  @ManyToOne(() => UserEntity, {
    nullable: false,
    eager: true,
  })
  public createdBy: UserEntity;

  @ManyToMany(() => UserEntity, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  public participants: UserEntity[];
}
