import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User roles',
    example: ['ADMIN'],
    type: [String],
    enum: ['ADMIN', 'AUTHOR', 'VIEWER'],
  })
  roles!: string[];

  @ApiProperty({
    description: 'User creation timestamp (ISO 8601)',
    example: '2025-12-23T00:52:31.126Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'User last update timestamp (ISO 8601)',
    example: '2025-12-23T00:52:31.126Z',
  })
  updated_at!: Date;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securepass123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Authenticated user information',
    type: UserResponseDto,
  })
  user!: UserResponseDto;
}
