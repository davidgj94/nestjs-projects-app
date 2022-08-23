import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProjectEntity } from '../entities/project.entity';

const fromEntityFactory =
  <T, U>(type: new () => T) =>
  (values: U) => {
    const intsance = new type();
    return Object.assign(intsance, values) as T;
  };

class ProjectDto implements Pick<ProjectEntity, keyof ProjectEntity> {
  public name: string;
  public createdBy: UserEntity;
  public createdById: string;
  public participants: UserEntity[];
  public participantsIds: string[];
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;
  static fromEntity = fromEntityFactory<ProjectDto, ProjectEntity>(this);
}
