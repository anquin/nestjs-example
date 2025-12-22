import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address (must be unique)',
    example: 'author@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters, will be hashed)',
    example: 'securepass123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'User roles',
    example: ['AUTHOR'],
    type: [String],
    enum: ['ADMIN', 'AUTHOR', 'VIEWER'],
  })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles!: UserRole[];
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Updated user roles',
    example: ['AUTHOR', 'ADMIN'],
    type: [String],
    enum: ['ADMIN', 'AUTHOR', 'VIEWER'],
    required: false,
  })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'author@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User roles',
    example: ['AUTHOR'],
    type: [String],
    enum: ['ADMIN', 'AUTHOR', 'VIEWER'],
  })
  roles!: string[];

  @ApiProperty({
    description: 'User creation timestamp (ISO 8601)',
    example: '2025-12-23T01:50:58.725Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'User last update timestamp (ISO 8601)',
    example: '2025-12-23T01:50:58.725Z',
  })
  updated_at!: Date;
}
