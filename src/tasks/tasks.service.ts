import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskNotFoundError, TaskUserInvalidError } from './tasks.errors';
import { ListTaskDto } from './dto/list-tasks-dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(userEmail: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.usersService.findOneByEmail(userEmail);

    const task = new Task({
      user: user,
      ...createTaskDto,
    });

    return await this.tasksRepository.save(task);
  }

  async update(
    id: number,
    userEmail: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const user = await this.usersService.findOneByEmail(userEmail);
    const task: Task | null = await this.tasksRepository.findOneBy({
      id: id,
    });

    if (!task) {
      throw new TaskNotFoundError();
    }

    if (task.user != user) {
      throw new TaskUserInvalidError();
    }

    return this.tasksRepository.save({
      id: task.id,
      ...updateTaskDto,
    });
  }

  async remove(id: number): Promise<void> {
    // performing a hard delete due to roadmap.sh's requirements
    try {
      this.tasksRepository.delete({ id: id });
    } catch (error) {
      throw new TaskNotFoundError();
    }
  }

  async list(userEmail: string, listTaskDto: ListTaskDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(userEmail);
    const total = await this.tasksRepository.countBy({ user: user });
    const tasks = await this.tasksRepository.find({
      where: {
        user: user,
      },
      take: listTaskDto.limit,
      skip: listTaskDto.limit * (listTaskDto.page - 1),
    });

    return {
      data: tasks,
      page: listTaskDto.page,
      limit: listTaskDto.limit,
      total: total,
    };
  }
}
