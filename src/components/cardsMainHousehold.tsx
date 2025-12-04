import { useQuery } from '@tanstack/react-query';
import { useHousehold } from '../context/HouseholdContext';
import { useEffect, useState } from 'react';
import { api } from "../apis/dashboard";
import { useAuth } from "../context/AuthContext";


const CardMainHousehold = () => {
  const { token } = useAuth();
  const { household } = useHousehold();
  const householdId = household?.id;

  const [recipeSuggestion, setRecipeSuggestion] = useState<string>("");
  const [mealPlanInsights, setMealPlanInsights] = useState<string>("");

  const { data: pantryItems = [] } = useQuery({
    queryKey: ["pantryItems", householdId],
    enabled: !!householdId,
    queryFn: async () => {
      const res = await api.get(`/pantryItem/?household_id=${householdId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.payload || [];
    },
  });

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans', householdId],
    enabled:!!householdId,
    queryFn: async () => {
      const res = await api.get(
        `/mealplan/?household_id=${householdId}`,{
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      return res.data?.payload || [];
    }
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes', householdId],
    enabled:!!householdId,
    queryFn: async () => {
      const res = await api.get(
        `/recipe/?household_id=${householdId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      return res.data?.payload || [];
    }
  });

  const recipeCalories = recipes.map((recipe) => {
    let total = 0;
    recipe.ingredients.forEach((ing) => {
      const calories = parseFloat(ing.caloriesPer100g);
      const quantity = parseFloat(ing.quantity);
      total += calories * quantity;
    });

    const perServing = recipe.serving ? total / recipe.serving : total;

    return {
      id: recipe.id,
      title: recipe.title,
      totalCalories: total,
      caloriesPerServing: perServing
    };
  });

  useEffect(() => {
    if (pantryItems.length === 0) return;
    const ingredients = pantryItems.map((item) => item.ingredient?.name).filter(Boolean);

    if (ingredients.length === 0) {
      const timeoutId = window.setTimeout(() => {
        setRecipeSuggestion("No ingredients available for recipe suggestion.");
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    let cancelled = false;

    api.post(
      "/api",
      { ingredients },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      if (cancelled) return;
      setRecipeSuggestion(res.data.recipe || "No recipe suggestion available.");
    })
    .catch(err => {
      if (cancelled) return;
      console.error("Error fetching AI recipe:", err);
      setRecipeSuggestion("Error generating recipe suggestion. Please try again.");
    });

    return () => { cancelled = true; };
  }, [pantryItems, token]);

  useEffect(() => {
    if (mealPlans.length === 0) return;

    const mealPlanNames = mealPlans
      .map((m) => m.recipe?.title || m.recipe?.name || "Unnamed meal")
      .filter(Boolean);

    api.post(
      "http://127.0.0.1:8000/api/v0.1/insight",
      { mealplans: mealPlanNames },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setMealPlanInsights(res.data.status === 'success' ? res.data.insights : "Failed to generate insights");
    })
    .catch(err => {
      console.error("Error fetching meal plan insights:", err);
      setMealPlanInsights("Error generating insights. Please try again later.");
    });
  }, [mealPlans, token]);

  const expiryList = pantryItems
    .map((item) => {
      const expiry = new Date(item.expiry_date);
      const now = new Date();
      const remainingDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { name: item.ingredient?.name, remainingDays };
    })
    .filter(item => item.remainingDays >= 0 && item.remainingDays <= 20);

  return (
    <div className="p-4 space-y-6">

      <div className="p-5 rounded-2xl shadow-md border-l-4 border-red-500">
        <h3 className="text-red-600 font-bold text-xl mb-3"> Items Expiring Soon</h3>
        {expiryList.length === 0 ? (
          <p className="text-gray-500">No items expiring soon.</p>
        ) : (
          <ul className="space-y-2">
            {expiryList.map((item, idx) => (
              <li key={idx} className="flex justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-semibold text-red-600 " >{item.remainingDays} days left</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className=" p-5 rounded-2xl shadow-md border-l-4 border-green-500">
        <h3 className="text-green-700 font-bold text-xl mb-3"> Recipes & Calories</h3>
        {recipeCalories.length === 0 ? (
          <p className="text-gray-500">No recipes found.</p>
        ) : (
          <ul className="space-y-2">
            {recipeCalories.map(r => (
              <li key={r.id} className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition text-gray-800">
                <p className="font-semibold text-gray-800">{r.title}</p>
                <p>Total: {r.totalCalories} cal</p>
                <p>Per Serving: {r.caloriesPerServing} cal</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-5 rounded-2xl shadow-md border-l-4 border-emerald-500">
        <h3 className="text-emerald-600 font-bold text-xl mb-3"> AI Recipe Suggestion</h3>
        {recipeSuggestion ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg whitespace-pre-wrap text-gray-800">{recipeSuggestion}</div>
        ) : (
          <p className="text-gray-500">Generating recipe suggestion...</p>
        )}
      </div>

      <div className=" p-5 rounded-2xl shadow-md border-l-4 border-blue-500">
        <h3 className="text-blue-600 font-bold text-xl mb-3"> Meal Plan Insights</h3>
        {mealPlanInsights ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg whitespace-pre-wrap text-gray-800">{mealPlanInsights}</div>
        ) : (
          <p className="text-gray-500">Generating insights...</p>
        )}
      </div>

    </div>
  );
};

export default CardMainHousehold;
