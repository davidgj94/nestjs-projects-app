import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../entities';

export class AbstractDto {
  @ApiHideProperty()
  @Exclude()
  isDto: true;

  @ApiProperty({ format: 'uuid' })
  readonly id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({ id, createdAt, updatedAt }: AbstractEntity) {
    Object.assign(this, {
      id,
      createdAt,
      updatedAt,
    });
  }
}
