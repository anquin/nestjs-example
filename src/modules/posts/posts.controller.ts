import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto } from './dtos';
import { JwtGuard, RolesGuard } from '@/modules/auth/guards';
import { Roles } from '@/common/decorators';
import { UserRole } from '../users';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new blog post. Requires AUTHOR or ADMIN role. The authenticated user becomes the post owner.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Post creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - missing or invalid title/content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (AUTHOR or ADMIN role required)',
  })
  async create(@Body() createPostDto: CreatePostDto, @Req() request: any): Promise<PostResponseDto> {
    const userId = request.user.sub;
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Retrieve a paginated list of all posts. No authentication required.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully with pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/PostResponseDto' },
        },
        total: { type: 'number', example: 42 },
      },
    },
  })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string): Promise<any> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.postsService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve a specific post by its UUID. No authentication required.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - post with this ID does not exist',
  })
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update post',
    description: 'Update a post by its UUID. Only the post owner or ADMIN can update a post.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiBody({
    type: UpdatePostDto,
    description: 'Updated post data',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - missing or invalid title/content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (only post owner or ADMIN)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - post with this ID does not exist',
  })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() request: any): Promise<PostResponseDto> {
    const userId = request.user.sub;
    const userRoles = request.user.roles;
    return this.postsService.update(id, updatePostDto, userId, userRoles);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete post',
    description: 'Delete a post by its UUID. Only the post owner or ADMIN can delete a post.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (only post owner or ADMIN)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - post with this ID does not exist',
  })
  async delete(@Param('id') id: string, @Req() request: any): Promise<void> {
    const userId = request.user.sub;
    const userRoles = request.user.roles;
    return this.postsService.delete(id, userId, userRoles);
  }
}
