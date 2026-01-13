import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../users/users.guard';
import { ListTaskDto } from './dto/list-tasks-dto';
import { TaskNotFoundError, TaskUserInvalidError } from './tasks.errors';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.username, createTaskDto);
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @Get()
  async list(
    @Request() req,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.tasksService.list(req.user.username, {
      page: page,
      limit: limit,
    });
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      return this.tasksService.update(+id, req.user.username, updateTaskDto);
    } catch (error: any) {
      if (error instanceof TaskNotFoundError) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: TaskNotFoundError.message,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
      if (error instanceof TaskUserInvalidError) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: TaskUserInvalidError.message,
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
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.tasksService.remove(+id);
  }
}
