import { Injectable, BadRequestException } from '@nestjs/common';

/**
 * Pagination Service
 * Handles pagination logic for paginated queries
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

/**
 * Default pagination constants
 */
export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

export class PaginationUtil {
  /**
   * Validates and calculates pagination parameters
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @throws BadRequestException if parameters are invalid
   * @returns Object with skip, take, page, and limit values
   */
  static paginate(
    page: number = PAGINATION_DEFAULTS.DEFAULT_PAGE,
    limit: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
  ): PaginationResult {
    // Validate page
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }

    // Validate limit
    if (limit < PAGINATION_DEFAULTS.MIN_LIMIT) {
      throw new BadRequestException(
        `Limit must be at least ${PAGINATION_DEFAULTS.MIN_LIMIT}`,
      );
    }

    if (limit > PAGINATION_DEFAULTS.MAX_LIMIT) {
      throw new BadRequestException(
        `Limit cannot exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`,
      );
    }

    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  /**
   * Calculates pagination from query parameters
   * @param params - Query parameters containing page and limit
   * @returns Pagination result
   */
  static fromQuery(params: PaginationParams): PaginationResult {
    const page = params.page || PAGINATION_DEFAULTS.DEFAULT_PAGE;
    const limit = params.limit || PAGINATION_DEFAULTS.DEFAULT_LIMIT;

    return this.paginate(page, limit);
  }

  /**
   * Gets the default pagination parameters
   * @returns Default pagination result
   */
  static getDefaults(): PaginationResult {
    return this.paginate(
      PAGINATION_DEFAULTS.DEFAULT_PAGE,
      PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    );
  }

  /**
   * Calculates total pages for a given count
   * @param total - Total number of items
   * @param limit - Items per page
   * @returns Total number of pages
   */
  static getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  /**
   * Validates if a page number is valid for given total items
   * @param page - Page number
   * @param total - Total items
   * @param limit - Items per page
   * @returns true if page is valid
   */
  static isValidPage(page: number, total: number, limit: number): boolean {
    const totalPages = this.getTotalPages(total, limit);
    return page >= 1 && page <= totalPages;
  }
}
