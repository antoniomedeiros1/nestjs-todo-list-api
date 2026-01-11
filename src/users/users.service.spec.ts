import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
      imports: [JwtModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const dummyUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      const userInstance = new User({
        id: 123,
        isActive: true,
        ...dummyUser,
      });

      mockRepository.findOneBy.mockResolvedValue({});
      mockRepository.save.mockResolvedValue(userInstance);

      const result = await service.create(dummyUser);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(123);
      expect(result.name).toBe('John Doe');
      expect(result.isActive).toBe(true);
    });

    it('should throw an "User already exists" error', async () => {
      const dummyUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      mockRepository.findOneBy.mockResolvedValue({
        id: 1,
        isActive: true,
        ...dummyUser,
      });

      await expect(service.create(dummyUser)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const userInstance = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        isActive: true,
      });

      mockRepository.find.mockResolvedValue([userInstance]);

      expect(await service.findAll()).toStrictEqual([userInstance]);
    });
  });

  describe('findOne', () => {
    it('should find one user', async () => {
      const userInstance = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        isActive: true,
      });

      mockRepository.findOneBy.mockResolvedValue(userInstance);

      expect(await service.findOne(123)).toBe(userInstance);
    });
  });

  describe('update', () => {
    it('should update a user name and email', async () => {
      const userInstance = new User({
        id: 123,
        name: 'Jon Doe',
        email: 'jondoe@example.com',
        password: 'password',
        isActive: true,
      });

      const updateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      mockRepository.findOneBy.mockImplementationOnce(() => userInstance);
      mockRepository.findOneBy.mockImplementationOnce(() => []);
      mockRepository.save.mockResolvedValue({
        ...userInstance,
        ...updateUserDto,
      });

      const result = await service.update(123, updateUserDto);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('johndoe@example.com');
    });
  });

  describe('remove', () => {
    it('should perform a soft delete of the given user', async () => {
      const userInstance = new User({
        id: 123,
        name: 'Jon Doe',
        email: 'jondoe@example.com',
        password: 'password',
        isActive: true,
      });

      mockRepository.findOneBy.mockImplementationOnce(() => userInstance);

      mockRepository.save.mockResolvedValue({
        ...userInstance,
        ...{ isActive: false },
      });

      const result = await service.remove(123);

      expect(result.isActive).toBeFalsy();
    });
  });
});
