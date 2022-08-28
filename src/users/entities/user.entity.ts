import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AuthenticationEntity } from 'src/auth/entities/auth.entity';

@Entity()
export class UserEntity extends AbstractEntity {
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
  @JoinColumn()
  public authentication: AuthenticationEntity;

  public get email() {
    return this.authentication.email;
  }
}
