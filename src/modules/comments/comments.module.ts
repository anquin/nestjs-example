import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts/posts.module';
import { Comment } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [PostsModule, TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {}
