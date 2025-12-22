import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtGuard, RolesGuard } from './guards';
import { AuthService } from '.';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
    RolesGuard,
  ],
  exports: [
    JwtGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
