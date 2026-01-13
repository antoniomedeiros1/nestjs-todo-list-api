import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskNotFoundError, TaskUserInvalidError } from './tasks.errors';
import { ListTaskDto } from './dto/list-tasks-dto';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

describe('TasksService', () => {
  let service: TasksService;

  let mockRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    countBy: jest.fn(),
  };

  let mockUsersRepository = {};

  let mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto = {
        title: 'Buy groceries',
        description: 'Buy milk, eggs, and bread',
      };

      const dummyUser = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_pass',
        isActive: true,
      });

      const expectedTask = new Task({
        id: 123,
        user: dummyUser,
        ...createTaskDto,
      });

      mockRepository.save.mockResolvedValue(expectedTask);
      mockUsersService.findOneByEmail.mockResolvedValue(dummyUser);

      const result = await service.create(dummyUser.email, createTaskDto);

      expect(result).toStrictEqual(expectedTask);
    });
  });

  describe('list', () => {
    it('should list all tasks for a given user', async () => {
      const id = 123;

      const dummyUser = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_pass',
        isActive: true,
      });

      const dummyTask = new Task({
        id: id,
        title: 'Buy groceries',
        description: 'Buy milk, eggs, bread and cheese',
        user: dummyUser,
      });

      const listTaskDto: ListTaskDto = {
        limit: 10,
        page: 1,
      };

      const expectedResult = {
        data: [dummyTask],
        limit: 10,
        page: 1,
        total: 1,
      };

      mockRepository.countBy.mockResolvedValue(1);
      mockRepository.find.mockResolvedValue([dummyTask]);
      mockUsersService.findOneByEmail.mockResolvedValue(dummyUser);

      const result = await service.list(dummyUser.email, listTaskDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const id = 123;

      const dummyUser = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_pass',
        isActive: true,
      });

      const dummyTask = new Task({
        id: id,
        title: 'Buy grocerie',
        description: 'Buy milk, eggs, bread and cheese',
        user: dummyUser,
      });

      const updateTaskDto = {
        title: 'Buy groceries',
        description: 'Buy milk, eggs, and bread',
      };

      const expectedTask = new Task({
        id: id,
        ...updateTaskDto,
      });

      mockRepository.findOneBy.mockResolvedValue(dummyTask);
      mockRepository.save.mockResolvedValue(expectedTask);
      mockUsersService.findOneByEmail.mockResolvedValue(dummyUser);

      const result = await service.update(id, dummyUser.email, updateTaskDto);

      expect(result).toStrictEqual(expectedTask);
    });

    it('should fail to update task and throw a task not found error', async () => {
      const id = 123;

      const dummyUser = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_pass',
        isActive: true,
      });

      const updateTaskDto = {
        title: 'Buy groceries',
        description: 'Buy milk, eggs, and bread',
      };

      mockRepository.findOneBy.mockResolvedValue(null);
      mockUsersService.findOneByEmail.mockResolvedValue(dummyUser);

      await expect(
        service.update(id, dummyUser.email, updateTaskDto),
      ).rejects.toThrow(TaskNotFoundError.message);
    });

    it('should fail to update task and throw a task user invalid error', async () => {
      const id = 123;

      const dummyUser = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hash_pass',
        isActive: true,
      });

      const dummyTask = new Task({
        id: id,
        title: 'Buy grocerie',
        description: 'Buy milk, eggs, bread and cheese',
        user: { ...dummyUser, id: 122 },
      });

      const updateTaskDto = {
        title: 'Buy groceries',
        description: 'Buy milk, eggs, and bread',
      };

      mockRepository.findOneBy.mockResolvedValue(dummyTask);
      mockUsersService.findOneByEmail.mockResolvedValue(dummyUser);

      await expect(
        service.update(id, dummyUser.email, updateTaskDto),
      ).rejects.toThrow(TaskUserInvalidError.message);
    });
  });
});
