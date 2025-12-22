import { PaginationUtil } from '@/common/utils';
import { EntityValidator } from '@/common/utils/entity.validator';
import { formatPaginatedResponse } from '@/common/utils/response.formatter';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationUtil } from '../../common/utils/authorization.util';
import { UserRole } from '../users';
import { Comment } from './comment.entity';
import { CommentResponseDto, CreateCommentDto, UpdateCommentDto } from './dtos';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(postId: string, createCommentDto: CreateCommentDto, userId: string): Promise<CommentResponseDto> {
    const comment = this.commentsRepository.create({
      post_id: postId,
      user_id: userId,
      content: createCommentDto.content,
    });

    const savedComment = await this.commentsRepository.save(comment);
    return this.mapCommentToResponse(savedComment);
  }

  async findByPost(postId: string, page: number = 1, limit: number = 10): Promise<ReturnType<typeof formatPaginatedResponse<CommentResponseDto>>> {
    const { skip, take } = PaginationUtil.paginate(page, limit);
    
    const [comments, total] = await this.commentsRepository.findAndCount({
      where: { post_id: postId },
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    return formatPaginatedResponse(
      comments.map(comment => this.mapCommentToResponse(comment)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    const validComment = EntityValidator.checkExists(comment, 'Comment', id);
    return this.mapCommentToResponse(validComment);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string, userRoles: UserRole[]): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    const validComment = EntityValidator.checkExists(comment, 'Comment', id);

    AuthorizationUtil.checkModifyPermission(userId, validComment.user_id, userRoles);

    if (updateCommentDto.content) {
      validComment.content = updateCommentDto.content;
    }

    const updatedComment = await this.commentsRepository.save(validComment);
    return this.mapCommentToResponse(updatedComment);
  }

  async delete(id: string, userId: string, userRoles: UserRole[]): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    const validComment = EntityValidator.checkExists(comment, 'Comment', id);

    AuthorizationUtil.checkDeletePermission(userId, validComment.user_id, userRoles);

    await this.commentsRepository.delete(id);
  }

  private mapCommentToResponse(comment: Comment): CommentResponseDto {
    return {
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    };
  }
}
