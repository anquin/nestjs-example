import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title (minimum 5 characters)',
    example: 'My First Blog Post',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  title!: string;

  @ApiProperty({
    description: 'Post content (minimum 10 characters)',
    example: 'This is the detailed content of my blog post with valuable information.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  content!: string;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Updated post title (minimum 5 characters)',
    example: 'Updated Blog Post Title',
    minLength: 5,
    required: false,
  })
  @IsString()
  @MinLength(5)
  title?: string;

  @ApiProperty({
    description: 'Updated post content (minimum 10 characters)',
    example: 'This is the updated content with new information.',
    minLength: 10,
    required: false,
  })
  @IsString()
  @MinLength(10)
  content?: string;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  id!: string;

  @ApiProperty({
    description: 'Post author UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  user_id!: string;

  @ApiProperty({
    description: 'Post title',
    example: 'My First Blog Post',
  })
  title!: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the detailed content of my blog post.',
  })
  content!: string;

  @ApiProperty({
    description: 'Post creation timestamp (ISO 8601)',
    example: '2025-12-23T01:51:03.024Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Post last update timestamp (ISO 8601)',
    example: '2025-12-23T01:51:03.024Z',
  })
  updated_at!: Date;

  @ApiProperty({
    description: 'Post author information (optional)',
    type: Object,
    required: false,
    example: {
      id: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
      email: 'admin@example.com',
    },
  })
  author?: {
    id: string;
    email: string;
  };
}
