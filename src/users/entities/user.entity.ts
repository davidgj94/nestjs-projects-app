import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, OneToOne } from 'typeorm';
import { AuthenticationEntity } from 'src/auth/entities/auth.entity';

@Entity({ name: 'User' })
export class UserEntity extends AbstractEntity {
  @Column()
  public email: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @OneToOne(
    () => AuthenticationEntity,
    (auth: AuthenticationEntity) => auth.user,
    {
      eager: true,
      nullable: false,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  public authentication: AuthenticationEntity;
}
