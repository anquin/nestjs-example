import { User, UsersService } from '@/modules/users';
import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { AuthResponseDto, LoginDto, UserResponseDto } from './dtos';
import { JwtTokenUtil, PasswordUtil } from './utils';

/**
 * Authorization Service
 * Handles permission checks and access control logic
 */
@Injectable()
export class AuthService {
    constructor(
      @Inject(forwardRef(() => UsersService))
      private usersService: UsersService,
    ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtil.verify(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = JwtTokenUtil.generateToken(user);

    return {
      access_token: token,
      user: this.mapUserToResponse(user),
    };
  }

  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
