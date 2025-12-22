import { NotFoundException } from '@nestjs/common';

/**
 * Entity Validator Utility
 * Provides reusable methods for validating entity existence
 */

/**
 * Throws a NotFoundException if entity is not found
 * @param entity - The entity to validate
 * @param entityName - Name of the entity (for error message)
 * @param id - ID of the entity (for error message)
 * @throws NotFoundException if entity is null or undefined
 */
export function validateEntityExists<T>(
  entity: T | null | undefined,
  entityName: string,
  id: string,
): asserts entity is T {
  if (!entity) {
    throw new NotFoundException(`${entityName} with ID ${id} not found`);
  }
}

/**
 * EntityValidator service for dependency injection
 * Wraps validation logic in a service format
 */
export class EntityValidator {
  /**
   * Validates that an entity exists
   * @param entity - The entity to check
   * @param entityName - Name of the entity for error message
   * @param id - The entity's ID
   * @throws NotFoundException
   */
  static checkExists<T>(
    entity: T | null | undefined,
    entityName: string,
    id: string,
  ): T {
    if (!entity) {
      throw new NotFoundException(`${entityName} with ID ${id} not found`);
    }
    return entity;
  }

  /**
   * Validates that multiple entities exist
   * @param entities - Array of entities to check
   * @param entityName - Name of the entity
   * @throws NotFoundException if any entities are missing
   */
  static checkAllExist<T>(
    entities: (T | null | undefined)[],
    entityName: string,
  ): T[] {
    const missing = entities.some((e) => !e);
    if (missing) {
      throw new NotFoundException(`One or more ${entityName} not found`);
    }
    return entities as T[];
  }

  /**
   * Validates that at least one entity exists
   * @param entities - Array of entities to check
   * @param entityName - Name of the entity
   * @returns First valid entity
   * @throws NotFoundException if all entities are missing
   */
  static checkAnyExist<T>(
    entities: (T | null | undefined)[],
    entityName: string,
  ): T {
    const existing = entities.find((e) => !!e);
    if (!existing) {
      throw new NotFoundException(`No ${entityName} found`);
    }
    return existing as T;
  }
}
