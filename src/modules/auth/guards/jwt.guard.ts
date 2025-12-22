import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenUtil } from '../utils';

@Injectable()
export class JwtGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const token = JwtTokenUtil.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const decoded = JwtTokenUtil.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = decoded;
    return true;
  }
}
