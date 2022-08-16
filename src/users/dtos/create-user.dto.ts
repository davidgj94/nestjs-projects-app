import { ApiProperty } from '@nestjs/swagger';
import { CreateAuthentionDto } from 'src/auth/dtos/create-authentication.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto extends CreateAuthentionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastName: string;
}
