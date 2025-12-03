import type { RecipeIngredient, MealPlan, PantryItem } from '../types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useHousehold } from '../context/HouseholdContext';
import { useAuth } from '../context/AuthContext';

const CardList = () => {
  const { household } = useHousehold();
  const { token } = useAuth();
  const householdId = household?.id;

  const extractPayload = (res: any) => res.data?.payload || [];


  const {
    data: pantryItems = [],
    isLoading: pantryLoading,
    error: pantryError,
  } = useQuery<PantryItem[]>({
    queryKey: ['pantryItems', householdId],
    enabled: !!householdId && !!token,
    retry: 2,
    queryFn: async () => {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/v0.1/pantryItem/?household_id=${householdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.status !== 'success') return [];
      return extractPayload(res);
    },
  });

 
  const {
    data: allMealPlans = [],
    isLoading: mealPlansLoading,
    error: mealPlansError,
  } = useQuery<MealPlan[]>({
    queryKey: ['allMealPlans', householdId],
    enabled: !!householdId && !!token,
    retry: 2,
    queryFn: async () => {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/v0.1/mealplan/?household_id=${householdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.status !== 'success') return [];
      return extractPayload(res);
    },
  });


  if (pantryLoading || mealPlansLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-blue-700 font-medium">Loading data...</span>
      </div>
    );
  }


  const renderError = (err: unknown) => (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      {(err as Error).message || 'An error occurred'}
    </div>
  );

  if (pantryError) return renderError(pantryError);
  if (mealPlansError) return renderError(mealPlansError);


  const safePantry = Array.isArray(pantryItems) ? pantryItems : [];
  const safePlans = Array.isArray(allMealPlans) ? allMealPlans : [];

  const missingIngredients: RecipeIngredient[] = [];

  safePlans.forEach(plan => {
    const ingredients = plan?.recipe?.ingredients || [];
    ingredients.forEach(ingredient => {
      if (!ingredient?.id) return;

      const exists = safePantry.some(p => p.ingredient_id === ingredient.id);
      const alreadyAdded = missingIngredients.some(i => i.id === ingredient.id);

      if (!exists && !alreadyAdded) missingIngredients.push(ingredient);
    });
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto mt-6 w-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Missing Ingredients
      </h2>

      {missingIngredients.length === 0 ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700">
          All ingredients are available!
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-3">
            You are missing <strong>{missingIngredients.length}</strong> ingredient(s):
          </p>

          <ul className="space-y-2">
            {missingIngredients.map(ingredient => (
              <li
                key={ingredient.id}
                className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                <span className="font-medium text-gray-800">{ingredient.name}</span>

              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CardList;
