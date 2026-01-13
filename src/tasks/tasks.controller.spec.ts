import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  let mockRepository = {};
  let mockUsersRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
      imports: [JwtModule, UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const dto = {
        title: 'Buy groceries',
        description: 'Buy milk, eggs, bread and cheese',
      };

      const user = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_password',
        isActive: true,
      });

      const task = new Task({
        id: 123,
        user: user,
        ...dto,
      });

      jest.spyOn(service, 'create').mockResolvedValue(task);

      const result = await controller.create(
        { user: { username: user.email } },
        dto,
      );

      expect(result).toStrictEqual(task);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const dto = {
        title: 'Buy groceries',
        description: 'Buy milk, eggs, bread and cheese',
      };

      const user = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_password',
        isActive: true,
      });

      const task = new Task({
        id: 123,
        user: user,
        ...dto,
      });

      jest.spyOn(service, 'update').mockResolvedValue(task);

      const result = await controller.update(
        { user: { username: user.email } },
        123,
        dto,
      );

      expect(result).toStrictEqual(task);
    });
  });
});
