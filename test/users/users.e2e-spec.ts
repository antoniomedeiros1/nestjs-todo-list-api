import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '../../src/users/users.module';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAlreadyExistsError } from '../../src/users/users.errors';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/register (POST)', () => {
    beforeEach(() => {
      const user = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashed_password',
        isActive: true,
      });
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(user);
    });

    it('should register new user successfully', () => {
      const payload = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/register')
        .send(payload)
        .expect(201)
        .expect({
          id: 123,
          name: 'John Doe',
          email: 'johndoe@example.com',
          isActive: true,
        });
    });

    it('should register new user successfully', () => {
      const payload = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };

      const user = new User({
        id: 123,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashed_password',
        isActive: true,
      });
      jest.spyOn(mockUsersRepository, 'findOneBy').mockResolvedValue(user);

      return request(app.getHttpServer())
        .post('/register')
        .send(payload)
        .expect(409)
        .expect({
          status: 409,
          error: UserAlreadyExistsError.message,
        });
    });
  });
});
