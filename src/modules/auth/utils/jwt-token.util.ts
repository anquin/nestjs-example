import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from '@/config';
import { User } from '@/modules/users';

export interface JwtPayload {
  sub: string | number;
  email: string;
  roles: string[];
  iat?: number;
}

@Injectable()
export class JwtTokenUtil {
  /**
   * Generate a new JWT token for a user
   * @param user - User entity
   * @returns Signed JWT token string
   */
  static generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      iat: Math.floor(Date.now() / 1000),
    };

    const privateKey = JwtConfig.getPrivateKey();
    return jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: JwtConfig.getExpiresIn(),
    } as any);
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token string
   * @returns Decoded JWT payload or null if invalid
   */
  static verifyToken(token: string): JwtPayload | null {
    try {
      const publicKey = JwtConfig.getPublicKey();
      return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify token and throw UnauthorizedException if invalid
   * @param token - JWT token string
   * @returns Decoded JWT payload
   * @throws UnauthorizedException
   */
  static verifyTokenOrThrow(token: string): JwtPayload {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return decoded;
  }

  /**
   * Extract JWT token from authorization header
   * @param authHeader - Authorization header value (e.g., "Bearer <token>")
   * @returns JWT token string or null if invalid format
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Check if token is expired
   * @param token - JWT token string
   * @returns true if token is expired, false otherwise
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return true;
    }
    return false;
  }

  /**
   * Get expiration time of a token in seconds from now
   * @param token - JWT token string
   * @returns Seconds until expiration, or -1 if token is invalid/expired
   */
  static getTokenExpirationTime(token: string): number {
    try {
      const publicKey = JwtConfig.getPublicKey();
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as any;
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp - now : -1;
    } catch (error) {
      return -1;
    }
  }

  /**
   * Decode token without verification (for debugging only)
   * @param token - JWT token string
   * @returns Decoded payload or null if invalid format
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload | null;
    } catch (error) {
      return null;
    }
  }
}
