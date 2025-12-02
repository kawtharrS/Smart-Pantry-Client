export interface WeekCardProps {
  day: string;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  unit_id: number;
  caloriesPer100g: string;
  proteinPer100g: string;
  fatPer100g: string;
  carbsPer100g: string;
}

export interface Recipe {
  id: number;
  household_id: number;
  user_id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  ingredients: RecipeIngredient[];
}

export interface MealPlan {
  id: number;
  day: string;
  recipe_id: number;
  household_id: number;
  recipe?: Recipe;
}

export interface PantryItem {
  id: number;
  ingredient_id: number;
  name: string;
  quantity: number;
}