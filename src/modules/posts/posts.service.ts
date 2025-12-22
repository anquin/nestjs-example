import { PaginationUtil } from '@/common/utils';
import { EntityValidator } from '@/common/utils/entity.validator';
import { formatPaginatedResponse } from '@/common/utils/response.formatter';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationUtil } from '../../common/utils/authorization.util';
import { UserRole } from '../users';
import { CreatePostDto, PostResponseDto, UpdatePostDto } from './dtos';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<PostResponseDto> {
    const post = this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      user_id: userId,
    });

    const savedPost = await this.postsRepository.save(post);
    return this.mapPostToResponse(savedPost);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ReturnType<typeof formatPaginatedResponse<PostResponseDto>>> {
    const { skip, take } = PaginationUtil.paginate(page, limit);
    
    const [posts, total] = await this.postsRepository.findAndCount({
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    return formatPaginatedResponse(
      posts.map(post => this.mapPostToResponse(post)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne({ where: { id } });
    const validPost = EntityValidator.checkExists(post, 'Post', id);
    return this.mapPostToResponse(validPost);
  }

  async findByAuthor(userId: string, page: number = 1, limit: number = 10): Promise<ReturnType<typeof formatPaginatedResponse<PostResponseDto>>> {
    const { skip, take } = PaginationUtil.paginate(page, limit);
    
    const [posts, total] = await this.postsRepository.findAndCount({
      where: { user_id: userId },
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    return formatPaginatedResponse(
      posts.map(post => this.mapPostToResponse(post)),
      total,
      page,
      limit,
    );
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string, userRoles: UserRole[]): Promise<PostResponseDto> {
    const post = await this.postsRepository.findOne({ where: { id } });
    const validPost = EntityValidator.checkExists(post, 'Post', id);

    AuthorizationUtil.checkModifyPermission(userId, validPost.user_id, userRoles);

    if (updatePostDto.title) validPost.title = updatePostDto.title;
    if (updatePostDto.content) validPost.content = updatePostDto.content;

    const updatedPost = await this.postsRepository.save(validPost);
    return this.mapPostToResponse(updatedPost);
  }

  async delete(id: string, userId: string, userRoles: UserRole[]): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id } });
    const validPost = EntityValidator.checkExists(post, 'Post', id);

    AuthorizationUtil.checkDeletePermission(userId, validPost.user_id, userRoles);

    await this.postsRepository.delete(id);
  }

  private mapPostToResponse(post: Post): PostResponseDto {
    return {
      id: post.id,
      user_id: post.user_id,
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      updated_at: post.updated_at,
    };
  }
}
