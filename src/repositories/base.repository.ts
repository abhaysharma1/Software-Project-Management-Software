import type { PaginatedResult, PaginationInput } from "@/validators/common"

export function buildPaginationArgs(input: PaginationInput) {
  return {
    take: input.limit,
    skip: input.cursor ? 1 : 0,
    cursor: input.cursor ? { id: input.cursor } : undefined,
  }
}

export function paginateResponse<T extends { id: string }>(
  items: T[],
  total: number,
  input: PaginationInput
): PaginatedResult<T> {
  return {
    items,
    nextCursor: items.length === input.limit ? items[items.length - 1].id : undefined,
    total,
  }
}
