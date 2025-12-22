import * as fs from 'fs';
import * as path from 'path';

export class JwtConfig {
  static getPrivateKey(): string {
    const keyPath = path.join(process.cwd(), 'keys', 'jwt.private.key');
    return fs.readFileSync(keyPath, 'utf-8');
  }

  static getPublicKey(): string {
    const keyPath = path.join(process.cwd(), 'keys', 'jwt.public.key');
    return fs.readFileSync(keyPath, 'utf-8');
  }

  static getExpiresIn(): string {
    return process.env.JWT_EXPIRATION || '1h';
  }
}
