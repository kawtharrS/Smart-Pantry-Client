import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type {WeekCardProps, RecipeIngredient, Recipe, MealPlan, PantryItem} from '../types';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';

const WeekCard = ({ day }: WeekCardProps) => {
  const { token } = useAuth();
  const { household } = useHousehold();
  const householdId = household?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [aiLoading, setAILoading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch meal plan for the day
  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery<MealPlan | null>({
    queryKey: ['mealPlan', day, householdId],
    queryFn: async () => {
      if (!householdId) return null;
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v0.1/mealplan/?day=${day}&household_id=${householdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.payload || null;
    },
    enabled: !!householdId,
  });

  // Fetch all recipes
  const { data: recipesData = [], isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ['recipes', householdId],
    queryFn: async () => {
      if (!householdId) return [];
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v0.1/recipe/?household_id=${householdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.payload || [];
    },
    enabled: !!householdId,
  });

  // Fetch pantry items
  const { data: pantryItems = [] } = useQuery<PantryItem[]>({
    queryKey: ['pantryItems', householdId],
    queryFn: async () => {
      if (!householdId) return [];
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v0.1/pantryItem/?household_id=${householdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.payload || [];
    },
    enabled: !!householdId,
  });

  // Fetch all meal plans for missing ingredient computation
  const { data: allMealPlans = [] } = useQuery<MealPlan[]>({
    queryKey: ['allMealPlans', householdId],
    queryFn: async () => {
      if (!householdId) return [];
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v0.1/mealplan/?household_id=${householdId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.payload || [];
    },
    enabled: !!householdId,
  });

  // Compute missing ingredients for the current recipe
  const missingIngredients: RecipeIngredient[] = [];
  mealPlan?.recipe?.ingredients.forEach(i => {
    const inPantry = pantryItems.some(p => p.ingredient_id === i.id);
    if (!inPantry) missingIngredients.push(i);
  });

  // Delete meal plan mutation
  const deleteMealPlan = useMutation({
    mutationFn: async () => {
      if (mealPlan?.id) {
        return await axios.get(
          `http://127.0.0.1:8000/api/v0.1/mealplan/delete/${mealPlan.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      throw new Error('No meal plan ID to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', day, householdId] });
      queryClient.invalidateQueries({ queryKey: ['allMealPlans', householdId] });
    },
  });

  // Save meal plan mutation
  const saveMealPlan = useMutation({
    mutationFn: async (recipe_id: number) => {
      if (!householdId) throw new Error('No household selected');
      const data = { day, recipe_id, household_id: householdId };
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v0.1/mealplan/add',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', day, householdId] });
      queryClient.invalidateQueries({ queryKey: ['allMealPlans', householdId] });
      setIsModalOpen(false);
    },
  });

  const selectRecipe = (recipe_id: number) => saveMealPlan.mutate(recipe_id);
  const removeRecipe = () => {
    if (mealPlan?.id && window.confirm('Are you sure you want to remove this recipe?')) {
      deleteMealPlan.mutate();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // AI Suggestion modal
  const openAIModal = async () => {
    if (!mealPlan?.recipe) return;
    setIsAIModalOpen(true);
    setAILoading(true);
    setAIResponse('');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v0.1/substitute',
        {
          ingredients: pantryItems.map(p => p.ingredient?.name).filter(Boolean),
          missing_ingredients: missingIngredients.map(i => i.name),
          recipe: mealPlan.recipe.title
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAIResponse(response.data.substitution || 'No suggestion returned.');
    } catch (err) {
      console.error(err);
      setAIResponse('Error fetching AI suggestion. Please try again.');
    } finally {
      setAILoading(false);
    }
  };
  const closeAIModal = () => setIsAIModalOpen(false);

  if (!householdId) {
    return (
      <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg shadow-md w-full h-full p-4 bg-white">
        <p className="text-lg font-semibold text-gray-700 mb-4">{day}</p>
        <p className="text-sm text-gray-500">Please select a household</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-full p-4 bg-white">
      <p className="text-lg font-semibold text-gray-700 mb-4">{day}</p>

      {mealPlanLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      ) : mealPlan?.recipe ? (
        <>
          <div className="w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{mealPlan.recipe.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mealPlan.recipe.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <ul className="text-gray-700 text-sm">
                {mealPlan.recipe.ingredients.map(i => {
                  const inPantry = pantryItems.some(p => p.ingredient_id === i.id);
                  return (
                    <li key={i.id} className={inPantry ? 'text-green-600' : 'text-red-600'}>
                      {i.name} {inPantry ? '(Available)' : '(Missing)'}
                    </li>
                  ); 
                })}
              </ul>
              <p className="text-gray-700">
                <span className="font-semibold">Servings:</span> {mealPlan.recipe.serving}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Prep:</span> {mealPlan.recipe.prep_time_min} min
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={openModal}
              disabled={saveMealPlan.isPending || deleteMealPlan.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {saveMealPlan.isPending ? 'Saving...' : 'Change'}
            </button>
            <button
              onClick={removeRecipe}
              disabled={deleteMealPlan.isPending}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleteMealPlan.isPending ? 'Removing...' : 'Remove'}
            </button>
            <button
              onClick={openAIModal}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              AI Suggestion
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={openModal}
          className="w-20 h-20 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
        >
          +
        </button>
      )}

      {/* Recipe Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Select Recipe for {day}</h2>
              <button onClick={closeModal} className="text-gray-100 text-2xl font-bold">×</button>
            </div>

            {recipesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading recipes...</p>
              </div>
            ) : recipesData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-2">No Recipes Yet</p>
                <p className="text-sm text-gray-500">Start by adding your first recipe!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recipesData.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => selectRecipe(recipe.id)}
                    className="w-full px-3 py-2 border !bg-amber-300 border-gray-300 rounded-md hover:bg-amber-400 text-gray-800 text-left"
                  >
                    {recipe.title}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-between">
              <Link to="/recipeEntry" className="text-green-600 hover:text-green-700 font-semibold" onClick={closeModal}>Go to Recipes →</Link>
              <button onClick={closeModal} className="px-4 py-2 text-gray-100 ">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">AI Suggestion</h2>
              <button onClick={closeAIModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
            </div>
            {aiLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Generating suggestion...</p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg whitespace-pre-wrap">
                {aiResponse}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button onClick={closeAIModal} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCard;
