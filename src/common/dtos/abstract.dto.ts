import { ApiProperty } from '@nestjs/swagger';

export class AbstractDto {
  @ApiProperty({ format: 'uuid' })
  readonly id: string;
}
