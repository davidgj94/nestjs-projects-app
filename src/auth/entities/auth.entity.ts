import { AbstractEntity } from 'src/common/entities';
import { isTestEnv } from 'src/config/constants/environment';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Roles } from '../types/roles.type';

@Entity()
export class AuthenticationEntity extends AbstractEntity {
  @Column()
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column(
    !isTestEnv
      ? { type: 'enum', enum: Roles, default: 'USER' as Roles }
      : { type: 'varchar', default: 'USER' as Roles },
  )
  public role: Roles;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.authentication)
  public user: UserEntity;
}
