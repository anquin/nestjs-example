import { ROLE_HIERARCHY } from '@/config';
import { UserRole } from '@/modules/users';
import { ForbiddenException, Injectable } from '@nestjs/common';

export class AuthorizationUtil {
  /**
   * Checks if user has one of the required roles
   * @param userRoles - User's roles
   * @param requiredRoles - Required roles (user must have at least one)
   * @throws ForbiddenException if user doesn't have required role
   */
  static requireRoles(userRoles: UserRole[], requiredRoles: UserRole[]): void {
    const hasRole = userRoles.some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Required one of these roles: ${requiredRoles.join(', ')}`,
      );
    }
  }

  /**
   * Checks if user has all of the required roles
   * @param userRoles - User's roles
   * @param requiredRoles - Required roles (user must have all)
   * @throws ForbiddenException if user doesn't have all required roles
   */
  static requireAllRoles(userRoles: UserRole[], requiredRoles: UserRole[]): void {
    const hasAllRoles = requiredRoles.every((role) =>
      userRoles.includes(role),
    );

    if (!hasAllRoles) {
      throw new ForbiddenException(
        `Required all of these roles: ${requiredRoles.join(', ')}`,
      );
    }
  }

  /**
   * Checks if user has minimum role level
   * @param userRoles - User's roles
   * @param minimumRole - Minimum role required
   * @throws ForbiddenException if user doesn't meet minimum role level
   */
  static requireMinimumRole(userRoles: UserRole[], minimumRole: UserRole): void {
    const userLevel = Math.max(
      ...userRoles.map((role) => ROLE_HIERARCHY[role] || 0),
    );
    const requiredLevel = ROLE_HIERARCHY[minimumRole];

    if (userLevel < requiredLevel) {
      throw new ForbiddenException(
        `Minimum required role: ${minimumRole}`,
      );
    }
  }

  /**
   * Checks if user can access a resource they own
   * @param userId - Current user's ID
   * @param resourceOwnerId - Owner's ID of the resource
   * @param userRoles - User's roles (admin can access any resource)
   * @throws ForbiddenException if user is not owner and not admin
   */
  static checkOwnership(
    userId: string,
    resourceOwnerId: string,
    userRoles: UserRole[] = [],
  ): void {
    const isOwner = userId === resourceOwnerId;
    const isAdmin = userRoles.includes(UserRole.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
  }

  /**
   * Checks if user can modify a resource
   * User can modify if they own it or are admin
   * @param userId - Current user's ID
   * @param resourceOwnerId - Owner's ID
   * @param userRoles - User's roles
   * @throws ForbiddenException if user can't modify
   */
  static checkModifyPermission(
    userId: string,
    resourceOwnerId: string,
    userRoles: UserRole[] = [],
  ): void {
    this.checkOwnership(userId, resourceOwnerId, userRoles);
  }

  /**
   * Checks if user can delete a resource
   * Only admin can delete resources they don't own
   * @param userId - Current user's ID
   * @param resourceOwnerId - Owner's ID
   * @param userRoles - User's roles
   * @throws ForbiddenException if user can't delete
   */
  static checkDeletePermission(
    userId: string,
    resourceOwnerId: string,
    userRoles: UserRole[] = [],
  ): void {
    const isOwner = userId === resourceOwnerId;
    const isAdmin = userRoles.includes(UserRole.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this resource',
      );
    }
  }

  /**
   * Gets the highest privilege level from user's roles
   * @param userRoles - User's roles
   * @returns Role with highest privilege level
   */
  static getHighestRole(userRoles: UserRole[]): UserRole | null {
    if (userRoles.length === 0) return null;

    return userRoles.reduce((highest, current) => {
      const highestLevel = ROLE_HIERARCHY[highest] || 0;
      const currentLevel = ROLE_HIERARCHY[current] || 0;
      return currentLevel > highestLevel ? current : highest;
    });
  }

  /**
   * Checks if user has admin role
   * @param userRoles - User's roles
   * @returns true if user is admin
   */
  static isAdmin(userRoles: UserRole[]): boolean {
    return userRoles.includes(UserRole.ADMIN);
  }

  /**
   * Checks if user has author role or higher
   * @param userRoles - User's roles
   * @returns true if user can create posts
   */
  static canCreatePost(userRoles: UserRole[]): boolean {
    const userLevel = Math.max(
      ...userRoles.map((role) => ROLE_HIERARCHY[role] || 0),
    );
    const authorLevel = ROLE_HIERARCHY[UserRole.AUTHOR];
    return userLevel >= authorLevel;
  }

  /**
   * Checks if user can create comments
   * All authenticated users can create comments
   * @param userRoles - User's roles
   * @returns true (all authenticated users can comment)
   */
  static canCreateComment(userRoles: UserRole[]): boolean {
    return userRoles.length > 0;
  }
}
