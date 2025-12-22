import { Comment } from '@/modules/comments';
import { Post } from '@/modules/posts';
import { User } from '@/modules/users';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nestjs_example',
  entities: [User, Post, Comment],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};
