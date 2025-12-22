import { Injectable } from '@nestjs/common';

/**
 * Response Formatter Utility
 * Standardizes all API responses across the application
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * Formats paginated data into a consistent response structure
 * @param data - Array of data items
 * @param total - Total count of items
 * @param page - Current page number (optional)
 * @param limit - Items per page (optional)
 * @returns Formatted paginated response
 */
export function formatPaginatedResponse<T>(
  data: T[],
  total: number,
  page?: number,
  limit?: number,
): PaginatedResponse<T> {
  const response: PaginatedResponse<T> = {
    data,
    total,
  };

  if (page !== undefined && limit !== undefined) {
    response.page = page;
    response.limit = limit;
  }

  return response;
}

/**
 * Formats single entity response
 * @param data - Single entity to return
 * @returns Formatted response
 */
export function formatSingleResponse<T>(data: T): T {
  return data;
}

/**
 * Formats success message response
 * @param message - Success message
 * @param data - Optional data to include
 * @returns Formatted success response
 */
export function formatSuccessResponse<T = void>(
  message: string,
  data?: T,
): { message: string; data?: T } {
  return {
    message,
    ...(data !== undefined && { data }),
  };
}

/**
 * ResponseFormatter class for consistent API responses
 * Can be injected as a service if needed
 */
export class ResponseFormatterService {
  static formatPaginated<T>(
    data: T[],
    total: number,
    page?: number,
    limit?: number,
  ): PaginatedResponse<T> {
    return formatPaginatedResponse(data, total, page, limit);
  }

  static formatSingle<T>(data: T): T {
    return formatSingleResponse(data);
  }

  static formatSuccess<T = void>(message: string, data?: T) {
    return formatSuccessResponse(message, data);
  }
}
