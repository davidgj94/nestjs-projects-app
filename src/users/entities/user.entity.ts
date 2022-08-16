import { AbstractEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity extends AbstractEntity {
  @Column()
  public firstName: string;

  @Column()
  public lastName: string;
}
