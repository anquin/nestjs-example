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
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from './dtos';
import { JwtGuard, RolesGuard } from '@/modules/auth/guards';
import { Roles } from '@/common/decorators';
import { UserRole } from '../users';

@Controller('posts/:postId/comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.VIEWER, UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a comment on a post',
    description: 'Create a new comment on a specific post. Requires any role (VIEWER, AUTHOR, or ADMIN).',
  })
  @ApiParam({
    name: 'postId',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Comment creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - missing or invalid comment content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (any role required)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - post with this ID does not exist',
  })
  async create(@Param('postId') postId: string, @Body() createCommentDto: CreateCommentDto, @Req() request: any): Promise<CommentResponseDto> {
    const userId = request.user.sub;
    return this.commentsService.create(postId, createCommentDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get comments for a post',
    description: 'Retrieve a paginated list of comments for a specific post. No authentication required.',
  })
  @ApiParam({
    name: 'postId',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
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
    description: 'Comments retrieved successfully with pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CommentResponseDto' },
        },
        total: { type: 'number', example: 5 },
      },
    },
  })
  async findByPost(@Param('postId') postId: string, @Query('page') page?: string, @Query('limit') limit?: string): Promise<any> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.commentsService.findByPost(postId, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get comment by ID',
    description: 'Retrieve a specific comment by its UUID. No authentication required.',
  })
  @ApiParam({
    name: 'postId',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment UUID',
    example: '7732eee1-4565-4499-92fe-f8206b16a234',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - comment with this ID does not exist',
  })
  async findOne(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.VIEWER, UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update comment',
    description: 'Update a comment by its UUID. Only the comment owner can update a comment.',
  })
  @ApiParam({
    name: 'postId',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment UUID',
    example: '7732eee1-4565-4499-92fe-f8206b16a234',
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'Updated comment data',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - missing or invalid comment content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (only comment owner)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - comment with this ID does not exist',
  })
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() request: any): Promise<CommentResponseDto> {
    const userId = request.user.sub;
    const userRoles = request.user.roles;
    return this.commentsService.update(id, updateCommentDto, userId, userRoles);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.VIEWER, UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete comment',
    description: 'Delete a comment by its UUID. Only the comment owner can delete a comment.',
  })
  @ApiParam({
    name: 'postId',
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment UUID',
    example: '7732eee1-4565-4499-92fe-f8206b16a234',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions (only comment owner)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - comment with this ID does not exist',
  })
  async delete(@Param('id') id: string, @Req() request: any): Promise<void> {
    const userId = request.user.sub;
    const userRoles = request.user.roles;
    return this.commentsService.delete(id, userId, userRoles);
  }
}
