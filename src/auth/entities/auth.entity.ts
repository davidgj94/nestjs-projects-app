import { AbstractEntity } from 'src/common/entities';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class AuthenticationEntity extends AbstractEntity {
  @Column()
  public password: string;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.authentication)
  public user: UserEntity;
}
