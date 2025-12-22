import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { typeormConfig } from '@/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { PostsModule } from '@/modules/posts/posts.module';
import { CommentsModule } from '@/modules/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}



