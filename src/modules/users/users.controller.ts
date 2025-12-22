import { Roles } from '@/common/decorators';
import { JwtGuard, RolesGuard } from '@/modules/auth/guards';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos';
import { UserRole } from './enums/user-role.enum';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with email, password, and roles. Requires ADMIN role.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - invalid email, short password, or invalid roles',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (ADMIN role required)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user with this email already exists',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users. Requires ADMIN role. Supports pagination with skip/take.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (ADMIN role required)',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their UUID. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (ADMIN role required)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - user with this ID does not exist',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update user roles',
    description: 'Update the roles of a specific user. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Updated user data (only roles can be updated)',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - invalid roles',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (ADMIN role required)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - user with this ID does not exist',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user by their UUID. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (ADMIN role required)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - user with this ID does not exist',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
