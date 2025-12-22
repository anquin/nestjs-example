import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { RolesGuard } from '@/modules/auth/guards';
import { UserRole } from '@/modules/users';

export const ROLES_KEY = 'roles';

/**
 * Decorator to require specific user roles
 * Combines @SetMetadata and @UseGuards for cleaner role checking
 * 
 * @example
 * @RequireRoles(UserRole.ADMIN, UserRole.AUTHOR)
 * deletePost() { ... }
 */
export const RequireRoles = (...roles: UserRole[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard),
  );
};

