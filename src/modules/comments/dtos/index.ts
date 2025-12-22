import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content (minimum 3 characters)',
    example: 'Great article! Very informative and well-written.',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  content!: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content (minimum 3 characters)',
    example: 'Updated comment with new thoughts.',
    minLength: 3,
    required: false,
  })
  @IsString()
  @MinLength(3)
  content?: string;
}

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment UUID',
    example: '7732eee1-4565-4499-92fe-f8206b16a234',
  })
  id!: string;

  @ApiProperty({
    description: 'Post UUID',
    example: 'fb93a6f6-1986-4a44-b8fc-9df6828f00c2',
  })
  post_id!: string;

  @ApiProperty({
    description: 'Comment author UUID',
    example: '62c119ea-abdd-4e1b-8c64-7979fdcfb29e',
  })
  user_id!: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'Great article! Very informative and well-written.',
  })
  content!: string;

  @ApiProperty({
    description: 'Comment creation timestamp (ISO 8601)',
    example: '2025-12-23T01:51:06.682Z',
  })
  created_at!: Date;

  @ApiProperty({
    description: 'Comment last update timestamp (ISO 8601)',
    example: '2025-12-23T01:51:06.682Z',
  })
  updated_at!: Date;

  @ApiProperty({
    description: 'Comment author information (optional)',
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
