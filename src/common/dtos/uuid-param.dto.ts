import { IsUUID } from 'class-validator';

export class UUIdParamsDto {
  @IsUUID()
  id: string;
}
