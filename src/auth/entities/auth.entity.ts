import { AbstractEntity } from 'src/common/entities';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Roles } from '../types/roles.type';

@Entity()
export class AuthenticationEntity extends AbstractEntity {
  @Column()
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column({ type: 'enum', enum: Roles, default: 'USER' as Roles })
  public role: Roles;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.authentication)
  public user: UserEntity;
}
