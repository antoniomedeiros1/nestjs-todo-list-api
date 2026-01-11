import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserPasswordIncorrectError,
} from './users.errors';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const currentUser: User | null = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (currentUser && currentUser.isActive) {
      throw new UserAlreadyExistsError();
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new User(createUserDto);

    return await this.usersRepository.save(newUser);
  }

  // TODO: these should be allowed for admin only
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.usersRepository.findOneBy({ id: id });

    if (!currentUser) {
      throw new UserNotFoundError();
    }

    if (updateUserDto.email) {
      const otherUser: User | null = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (otherUser && otherUser.isActive) {
        throw new UserAlreadyExistsError();
      }
    }

    return await this.usersRepository.save({
      id: currentUser.id,
      ...updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    const currentUser = await this.usersRepository.findOneBy({ id: id });

    if (!currentUser) {
      throw new UserNotFoundError();
    }

    return await this.usersRepository.save({
      id: currentUser.id,
      isActive: false,
    });
  }

  // TODO: move this to auth module
  async login(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ email: email });

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!(await bcrypt.compare(password, user?.password))) {
      throw new UserPasswordIncorrectError();
    }

    return {
      token: await this.jwtService.signAsync({
        sub: user.id,
        username: user.email,
      }),
    };
  }
}
