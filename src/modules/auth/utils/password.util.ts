import { PASSWORD_CONFIG } from '@/config';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Password Service
 * Handles password hashing, validation, and verification
 */

@Injectable()
export class PasswordUtil {
  /**
   * Hashes a plaintext password using bcrypt
   * @param password - Plaintext password to hash
   * @returns Hashed password
   * @throws BadRequestException if password is invalid
   */
  static async hash(password: string): Promise<string> {
    this.validate(password);
    return bcrypt.hash(password, PASSWORD_CONFIG.BCRYPT_ROUNDS);
  }

  /**
   * Verifies a plaintext password against a hash
   * @param plainPassword - Plaintext password
   * @param hashedPassword - Previously hashed password
   * @returns true if passwords match
   */
  static async verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Validates password requirements
   * @param password - Password to validate
   * @throws BadRequestException if password doesn't meet requirements
   */
  static validate(password: string): void {
    if (!password || password.length < PASSWORD_CONFIG.MIN_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters long`,
      );
    }
  }

  /**
   * Checks if a password needs to be rehashed
   * Useful for updating hashes when bcrypt rounds change
   * @param hashedPassword - Currently hashed password
   * @returns true if password should be rehashed
   */
  static shouldRehash(hashedPassword: string): boolean {
    // Extract the rounds from the hash (format: $2a$10$...)
    const parts = hashedPassword.split('$');
    if (parts.length < 4) return false;

    const currentRounds = parseInt(parts[2], 10);
    return currentRounds !== PASSWORD_CONFIG.BCRYPT_ROUNDS;
  }

  /**
   * Generates a temporary password
   * @param length - Length of temporary password (default 12)
   * @returns Random temporary password
   */
  static generateTemporary(length: number = 12): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Calculates password strength (0-4)
   * Useful for frontend validation feedback
   * @param password - Password to analyze
   * @returns Strength level (0-4)
   */
  static calculateStrength(password: string): number {
    let strength = 0;

    // Length check
    if (password.length >= PASSWORD_CONFIG.MIN_LENGTH) strength++;
    if (password.length >= 12) strength++;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    return Math.min(strength, 4);
  }
}
