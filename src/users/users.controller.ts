import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserPasswordIncorrectError,
} from './users.errors';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './users.guard';
import { ApiSecurity } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error: any) {
      if (error instanceof UserAlreadyExistsError) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: UserAlreadyExistsError.message,
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          },
        );
      }
      throw error;
    }
  }

  // @Get()
  // async findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    try {
      return this.usersService.login(loginDto.email, loginDto.password);
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: UserNotFoundError.message,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
      if (error instanceof UserPasswordIncorrectError) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: UserPasswordIncorrectError.message,
          },
          HttpStatus.UNAUTHORIZED,
          {
            cause: error,
          },
        );
      }
      throw error;
    }
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
