import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type {WeekCardProps, RecipeIngredient, Recipe, MealPlan,PantryItem} from '../types';

const WeekCard = ({ day }: WeekCardProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery<MealPlan | null>({
    queryKey: ['mealPlan', day],
    queryFn: async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/mealplan/?day=${day}`);
      console.log(response);
      return response.data.payload || null;
    },
    retry: 1,
  });

  const { data: recipesData = [], isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/recipe/recipes');
      return response.data.payload || [];
    },
  });
    
  const { data: pantryItems = [] } = useQuery<PantryItem[]>({
    queryKey: ['pantryItems'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/pantryItem/');
      return response.data.payload || [];
    }
  });

  const { data: allMealPlans = [] } = useQuery<MealPlan[]>({
      queryKey: ['allMealPlans'],
      queryFn: async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/mealplan/');
        return response.data.payload || [];
      },
    });

  const missingIngredientsAllPlans: RecipeIngredient[] = [];

  allMealPlans.forEach(plan => {
      plan.recipe?.ingredients.forEach(ingredient => {
        const isInPantry = pantryItems.some(p => p.ingredient_id === ingredient.id);
        if (!isInPantry) {
          if (!missingIngredientsAllPlans.some(i => i.id === ingredient.id)) {
            missingIngredientsAllPlans.push(ingredient);
          }
        }
      });
    });

  const deleteMealPlan = useMutation({
    mutationFn: async () => {
      if (mealPlan?.id) {
        return await axios.get(`http://127.0.0.1:8000/api/mealplan/delete/${mealPlan.id}`);
      }
      throw new Error('No meal plan ID to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', day] });
    },
  });

  const saveMealPlan = useMutation({
    mutationFn: async (recipe_id: number) => {
      const data = { day, recipe_id: recipe_id, household_id: 1 };
      const response = await axios.post('http://127.0.0.1:8000/api/mealplan/add', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', day] });
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
          <div className="mt-4 flex space-x-2">
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
          </div>
        </>
      ) : (
        <>
          <button
            onClick={openModal}
            disabled={saveMealPlan.isPending}
            className="w-20 h-20 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 disabled:opacity-50"
          >
            {saveMealPlan.isPending ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Click to add <br /> a recipe
          </p>
        </>
      )}

      <div className="absolute bottom-2 right-2">
        <Link to="/shopping-list/weekly">
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button>
        </Link>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Select Recipe for {day}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold" disabled={saveMealPlan.isPending}>×</button>
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
                    disabled={saveMealPlan.isPending}
                    className="w-full px-3 py-2 border !bg-amber-300 border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {recipe.title}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-between">
              <Link to="/recipeEntry" className="text-green-600 hover:text-green-700 font-semibold" onClick={closeModal}>Go to Recipes →</Link>
              <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800" disabled={saveMealPlan.isPending}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>


  );
};

export default WeekCard;
