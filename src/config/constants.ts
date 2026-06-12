export const DIET_TYPES = ["normal", "vegetarian", "diet"] as const;
export type DietType = (typeof DIET_TYPES)[number];

export const DIET_TYPE_LABELS: Record<DietType, string> = {
  normal: "Thường",
  vegetarian: "Chay",
  diet: "Ăn kiêng",
};

export const DIET_TYPE_WEIGHTS: Record<DietType, number> = {
  normal: 80,
  vegetarian: 10,
  diet: 10,
};

export const RECIPE_SOURCES = [
  "Cookpad",
  "Dien May Xanh",
  "Savoury Days",
  "Other",
] as const;
export type RecipeSource = (typeof RECIPE_SOURCES)[number];

export const ITEMS_PER_PAGE = 12;

export const ADMIN_ITEMS_PER_PAGE = 20;

export const CACHE_TAGS = {
  dishes: "dishes",
  recipes: "recipes",
  categories: "categories",
  ingredients: "ingredients",
  banners: "banners",
  settings: "settings",
} as const;
