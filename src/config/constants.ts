/**
 * Application Configuration Constants
 * Single source of truth for all application constants
 */

import { UserRole } from "@/modules/users";

/**
 * Role hierarchy (higher number = more permissions)
 */
export const ROLE_HIERARCHY = {
  [UserRole.VIEWER]: 1,
  [UserRole.AUTHOR]: 2,
  [UserRole.ADMIN]: 3,
};

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

/**
 * Password configuration
 */
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 6,
  BCRYPT_ROUNDS: 10,
};

/**
 * JWT configuration
 */
export const JWT_CONFIG = {
  ALGORITHM: 'RS256',
  EXPIRATION: '24h',
  ISSUER: 'nestjs-app',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden: insufficient permissions',
  NOT_FOUND: 'Resource not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  WEAK_PASSWORD: `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
};
