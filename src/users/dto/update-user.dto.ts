import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  name?: string | undefined;

  @ApiProperty()
  @IsEmail()
  email?: string | undefined;

  @ApiProperty()
  @IsString()
  password?: string | undefined;
}
