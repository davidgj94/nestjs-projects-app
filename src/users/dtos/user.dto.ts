import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from 'src/common/dtos';
import { UserEntity } from '../entities/user.entity';

export class UserDto
  extends AbstractDto
  implements Pick<UserEntity, 'firstName' | 'lastName' | 'email'>
{
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsEmail()
  public email: string;

  constructor(user: UserEntity) {
    super(user);
    const { firstName, lastName, email } = user;
    Object.assign(this, { firstName, lastName, email });
  }

  static fromEntity(user: UserEntity) {
    return new UserDto(user);
  }
}
