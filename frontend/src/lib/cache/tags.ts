export const cacheTags = {
  dish: (slug: string) => `dish-${slug}`,
  recipes: (dishSlug: string) => `recipes-${dishSlug}`,
  category: (slug: string) => `category-${slug}`,
  categories: "categories",
  banners: "banners",
  settings: "settings",
  nutrition: (dishSlug: string) => `nutrition-${dishSlug}`,
} as const;
