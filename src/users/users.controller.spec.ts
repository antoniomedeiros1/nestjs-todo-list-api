import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAlreadyExistsError } from './users.errors';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const mockRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
      imports: [JwtModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      const user = new User({ ...dto, id: 123, isActive: true });

      jest.spyOn(service, 'create').mockResolvedValue(user);

      const result = await controller.create(dto);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(123);
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('johndoe@example.com');
      expect(result.isActive).toBeTruthy();
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw an conflict http error', async () => {
      const dummyUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new UserAlreadyExistsError();
      });

      await expect(controller.create(dummyUser)).rejects.toThrow(
        'Http Exception',
      );

      expect(service.create).toHaveBeenCalledWith(dummyUser);
    });
  });
});
