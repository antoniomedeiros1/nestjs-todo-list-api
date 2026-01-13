import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ListTaskDto {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;
}
