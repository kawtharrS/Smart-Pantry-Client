import type { RecipeIngredient, MealPlan, PantryItem } from '../types';
import { useQuery } from '@tanstack/react-query';
import { api } from '../apis/dashboard';
import { useHousehold } from '../context/HouseholdContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react'; 

const CardList = () => {
  const { household } = useHousehold();
  const { user, token } = useAuth();
  const [isWebhookSending, setIsWebhookSending] = useState(false);
  const [hasSentWebhook, setHasSentWebhook] = useState(false);
  const prevMissingCountRef = useRef<number>(0); 
  
  const householdId = household?.id;
  const WEBHOOK_URL = "http://localhost:5678/webhook-test/shopping";

  const {
    data: pantryItems = [],
    isLoading: pantryLoading,
    error: pantryError,
  } = useQuery<PantryItem[]>({
    queryKey: ['pantryItems', householdId],
    queryFn: async () => {
      if (!householdId || !token) throw new Error('Missing household ID or token');
      
      const res = await api.get(`/pantryItem/?household_id=${householdId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.payload || [];
    },
    enabled: !!householdId && !!token,
  });

  const {
    data: allMealPlans = [],
    isLoading: mealPlansLoading,
    error: mealPlansError,
  } = useQuery<MealPlan[]>({
    queryKey: ['allMealPlans', householdId],
    enabled: !!householdId && !!token,
    queryFn: async () => {
      const res = await api.get(`/mealplan/?household_id=${householdId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.payload || [];
    },
  });

  const sendWebhook = async () => {
    if (!householdId || !token || !user?.id) {
      console.error('Missing required data for webhook');
      return;
    }

    setIsWebhookSending(true);
    try {
      await axios.post(WEBHOOK_URL, {
        token,
        householdId,
        userId: user.id,
        missingIngredientsCount: missingIngredients.length,
        missingIngredientNames: missingIngredients.map(i => i.name), 
        timestamp: new Date().toISOString(),
      });
      console.log("Successfully sent to n8n");
      setHasSentWebhook(true);
    } catch (e) {
      console.error("Webhook failed:", e);
    }
  };


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

  useEffect(() => {
    if (
      missingIngredients.length > 0 &&
      missingIngredients.length !== prevMissingCountRef.current &&
      !isWebhookSending
    ) {
      console.log(`Missing ingredients changed from ${prevMissingCountRef.current} to ${missingIngredients.length}, triggering webhook`);
      sendWebhook();
      prevMissingCountRef.current = missingIngredients.length;
    } else if (missingIngredients.length === 0 && prevMissingCountRef.current > 0) {
      console.log('All ingredients available, resetting count');
      prevMissingCountRef.current = 0;
      setHasSentWebhook(false);
    }
  }, [missingIngredients.length, isWebhookSending]);

  useEffect(() => {
    if (missingIngredients.length > 0 && !hasSentWebhook && !isWebhookSending) {
      console.log(`Initial load with ${missingIngredients.length} missing ingredients, triggering webhook`);
      sendWebhook();
      prevMissingCountRef.current = missingIngredients.length;
    }
  }, [missingIngredients.length]); 

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

  return (
  <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto mt-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800">
        Missing Ingredients
      </h2>
    </div>

    {missingIngredients.length === 0 ? (
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-700">
        All ingredients are available!
      </div>
    ) : (
      <>
        <p className="text-gray-600 mb-3">
          You are missing <strong>{missingIngredients.length}</strong> ingredient(s):
          {hasSentWebhook && (
            <span className="ml-2 text-sm text-green-600">✓ Sent to shopping list</span>
          )}
        </p>

        <ul className="space-y-3">
          {missingIngredients.map((ingredient) => (
            <li
              key={ingredient.id}
              className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm transition hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />

              <span className="ml-3 font-medium text-gray-800">
                {ingredient.name}
              </span>

              {ingredient.quantity && (
                <span className="ml-2 text-gray-600">({ingredient.quantity})</span>
              )}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);
}

export default CardList;