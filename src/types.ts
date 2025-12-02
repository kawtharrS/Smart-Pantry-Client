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

export interface CardIngredientProps {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  expiry_date: string;
  quantity: number;
  textColor?: string;
  onClick?: (id: number) => void; 
}
export interface Ingredient {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  expiry_date: string;
  quantity: number;
  textColor?: string;
}

export interface ApiResponse {
  status: string;
  payload: {
    id: number;
    unit_id: number;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    fatsPer100g: number;
    carbsPer100g: number;
    expiry_date: string;
    quantity: number;
    created_at: string;
    updated_at: string;
  }[];
}

export interface NewIngredientData {
  name: string;
  unit_id:number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  expiry_date?: string;
  quantity?: number;
}

export interface CardPantryItemProps {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  location?: string;
  textColor?: string;
  onClick?: (id: number) => void;
}

export interface IngredientPantry {
  id: number;
  name: string;
}

export interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  location?: string;
  textColor?: string;
}

export interface PantryApiResponse {
  status: string;
  payload: {
    id: number;
    ingredient: {
      id: number;
      name: string;
    };
    quantity: number;
    expiry_date: string;
    location?: string;
    created_at: string;
    updated_at: string;
  }[];
}

export interface IngredientApiResponse {
  status: string;
  payload: IngredientPantry[];
}

export interface PantryItemO {
  household_id: number;    
  ingredient_id: number;  
  unit_id: number;
  quantity:number,
  location?: string;
  expiry_date?: string;
}

export interface BarToDoProps {
  ingredients: { id: number; name: string }[];
  householdId: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  textColor?: string;
}

export interface ApiResponseRecipe {
  status: string;
  payload: {
    id: number;
    household_id: number;
    user_id: number;
    title: string;
    description: string;
    prep_time_min: number;
    cook_time_min: number;
    serving: number;
    created_at: string;
    updated_at: string;
  }[];
}

export interface IngredientRecipe {
  id: number;
  name: string;
  unit_id?: number;
}