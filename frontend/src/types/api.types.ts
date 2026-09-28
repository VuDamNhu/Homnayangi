export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export type ApiErrorCode =
  | "DISH_NOT_FOUND"
  | "RECIPE_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "DUPLICATE_SLUG"
  | "VALIDATION_FAILED"
  | "UNAUTHENTICATED"
  | "UPLOAD_FAILED"
  | "AI_UNAVAILABLE"
  | "MAPS_UNAVAILABLE"
  | "INTERNAL_ERROR";
