import type { DietType } from "@/config/constants";

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  coverImage: string;
  dietType: DietType | "all";
  displayOrder: number;
  isActive: boolean;
  dishCount: number;
}

// ─── Ingredient ───────────────────────────────────────────────────────────────

export type IngredientUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "cái"
  | "quả"
  | "muỗng canh"
  | "muỗng cà phê"
  | "nhánh"
  | "lá"
  | "tép"
  | "bó"
  | "miếng"
  | "con"
  | "túi";

export type IngredientCategory =
  | "protein"
  | "vegetable"
  | "carb"
  | "seasoning"
  | "fat"
  | "herb"
  | "other";

export interface Ingredient {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  imageUrl: string;
  category: IngredientCategory;
  defaultUnit: IngredientUnit;
  isCommon: boolean;
  caloriesPer100g: number;
}

// ─── Dish ─────────────────────────────────────────────────────────────────────

export type DishDifficulty = "easy" | "normal" | "hard" | "expert";
export type DishRank = "normal" | "master" | "elite" | "s-class";

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sodium: number;
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  dietType: DietType;
  categoryId: string;
  tags: string[];
  cuisine: string;
  difficulty: DishDifficulty;
  averageCookTime: number;
  nutrition: NutritionInfo;
  rank: DishRank;
  xpReward: number;
  isPopular: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  recipeCount: number;
}

// ─── Recipe ───────────────────────────────────────────────────────────────────

export type RecipeSource = "Cookpad" | "Dien May Xanh" | "Savoury Days" | "Other";

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  note?: string;
  isOptional: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  body: string;
  imageUrl?: string;
  tip?: string;
  durationMinutes?: number;
}

export interface Recipe {
  id: string;
  slug: string;
  dishId: string;
  dishName: string;
  title: string;
  description: string;
  coverImage: string;
  source: RecipeSource;
  sourceUrl: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  difficulty: DishDifficulty;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition: NutritionInfo;
  authorNote?: string;
  rating: number;
  viewCount: number;
  xpReward: number;
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export type BannerVariant = "hero" | "promo" | "category" | "feature";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  variant: BannerVariant;
  dietType?: DietType;
  isActive: boolean;
  displayOrder: number;
  startDate: string;
  endDate: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | "new_dish"
  | "new_recipe"
  | "promotion"
  | "system"
  | "achievement";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  imageUrl?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
