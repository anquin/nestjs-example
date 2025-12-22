import { EntityValidator } from '@/common/utils/entity.validator';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordUtil } from '../auth/utils';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await PasswordUtil.hash(createUserDto.password);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      password_hash: passwordHash,
      roles: createUserDto.roles,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.mapUserToResponse(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map(user => this.mapUserToResponse(user));
  }

   async findOne(id: string): Promise<UserResponseDto> {
     const user = await this.usersRepository.findOne({ where: { id } });
     const validUser = EntityValidator.checkExists(user, 'User', id);
     return this.mapUserToResponse(validUser);
   }

   async findByEmail(email: string): Promise<User | null> {
     return this.usersRepository.findOne({ where: { email } });
   }

   async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const validUser = EntityValidator.checkExists(user, 'User', id);

    if (updateUserDto.roles) {
      validUser.roles = updateUserDto.roles;
    }

    const updatedUser = await this.usersRepository.save(validUser);
    return this.mapUserToResponse(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    EntityValidator.checkExists(user, 'User', id);
    await this.usersRepository.delete(id);
  }

  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
