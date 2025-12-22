import { UserRole } from '@/modules/users';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to assign required roles to a route handler
 * Used with RolesGuard to enforce role-based access control
 *
 * @example
 * @Roles(UserRole.ADMIN, UserRole.AUTHOR)
 * deletePost() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
