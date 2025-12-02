import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from 'react-router-dom';

interface RecipeIngredient {
  ingredient_id: number;
  quantity: number;
  unit_id: number;
  note?: string;
}

interface Recipe {
  household_id: number;
  user_id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  ingredients: RecipeIngredient[]; 
}

interface BarToDoRecipeProps {
  ingredients: { id: number; name: string; unit_id?: number }[];
  householdId: number;
  userId: number;
}

const BarToDoRecipe = ({ ingredients, householdId, userId }: BarToDoRecipeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    prep_time_min: "",
    cook_time_min: "",
    serving: "",
  });

  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([
    { ingredient_id: 0, quantity: 0, unit_id: 1, note: "" }
  ]);

  const addRecipeMutation = useMutation({
    mutationFn: async (data: Recipe) => {
      console.log("Sending recipe data:", data);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/recipe/add",
        data
      );
      return response.data;
    },
    onSuccess: (result) => {
      console.log("Recipe added:", result);
      setNewRecipe({ title: "", description: "", prep_time_min: "", cook_time_min: "", serving: "" });
      setRecipeIngredients([{ ingredient_id: 0, quantity: 0, unit_id: 1, note: "" }]);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to add recipe:", error);
      console.error("Error details:", error.response?.data);
    },
  });

  const handleAddRecipe = () => {
    if (!newRecipe.title.trim()) {
      alert("Please enter a recipe title");
      return;
    }

    const invalidIngredients = recipeIngredients.filter(
      ing => ing.ingredient_id === 0 || ing.quantity <= 0
    );
    
    if (invalidIngredients.length > 0) {
      alert("Please select valid ingredients with quantities");
      return;
    }

    const recipeData: Recipe = {
      household_id: householdId,
      user_id: userId,
      title: newRecipe.title,
      description: newRecipe.description,
      prep_time_min: parseInt(newRecipe.prep_time_min) || 0,
      cook_time_min: parseInt(newRecipe.cook_time_min) || 0,
      serving: parseInt(newRecipe.serving) || 1,
      ingredients: recipeIngredients,
    };

    addRecipeMutation.mutate(recipeData);
  };

  const addIngredientRow = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      { ingredient_id: 0, quantity: 0, unit_id: 1, note: "" }
    ]);
  };

  const removeIngredientRow = (index: number) => {
    if (recipeIngredients.length === 1) {
      setRecipeIngredients([{ ingredient_id: 0, quantity: 0, unit_id: 1, note: "" }]);
    } else {
      const updatedIngredients = recipeIngredients.filter((_, i) => i !== index);
      setRecipeIngredients(updatedIngredients);
    }
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const updatedIngredients = [...recipeIngredients];
    
    if (field === 'quantity' || field === 'unit_id' || field === 'ingredient_id') {
      updatedIngredients[index][field] = Number(value);
    } else {
      updatedIngredients[index][field] = value;
    }
    
    setRecipeIngredients(updatedIngredients);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="flex fixed rounded-r-2xl top-20 left-64 p-3 bg-gray-400 backdrop-blur-md shadow-md w-[calc(100%-16rem)] z-40 justify-between">
        <h2 className="p-2 font-bold text-xl flex-1">Create your own Recipe</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="!bg-white shadow-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-black font-black text-3xl"
        >
          +
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 overflow-y-auto max-h-[90vh] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-emerald-900">Create New Recipe</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Recipe Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newRecipe.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    placeholder="e.g., Spaghetti Bolognese"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newRecipe.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    placeholder="Describe your recipe..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prep Time (min)
                    </label>
                    <input
                      type="number"
                      name="prep_time_min"
                      value={newRecipe.prep_time_min}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cook Time (min)
                    </label>
                    <input
                      type="number"
                      name="cook_time_min"
                      value={newRecipe.cook_time_min}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Servings
                    </label>
                    <input
                      type="number"
                      name="serving"
                      value={newRecipe.serving}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Ingredients</h4>
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    className="px-3 py-1 !bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200"
                  >
                    + Add Ingredient
                  </button>

                  <Link to="/ingEntry"
                    type="button"
                    onClick={addIngredientRow}
                    className="px-3 py-1 !bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200"
                  >
                    - create an ingredient
                  </Link>
                </div>

                <div className="space-y-4">
                  {recipeIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ingredient <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={ingredient.ingredient_id}
                          onChange={(e) => updateIngredient(index, 'ingredient_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                          required
                        >
                          <option value={0}>Select Ingredient</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                          placeholder="0"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <select
                          value={ingredient.unit_id}
                          onChange={(e) => updateIngredient(index, 'unit_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                        >
                          <option value={1}>Grams (g)</option>
                          <option value={2}>Kilograms (kg)</option>
                          <option value={3}>Milliliters (ml)</option>
                          <option value={4}>Liters (L)</option>
                          <option value={5}>Pieces</option>
                        </select>
                      </div>

                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Note
                        </label>
                        <input
                          type="text"
                          value={ingredient.note || ""}
                          onChange={(e) => updateIngredient(index, 'note', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                          placeholder="Optional"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeIngredientRow(index)}
                        className="mt-6 px-2 py-2 !bg-orange-200 text-red-600 hover:text-red-800"
                        title="Remove ingredient"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddRecipe}
                disabled={addRecipeMutation.isPending || !newRecipe.title.trim()}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {addRecipeMutation.isPending ? "Creating Recipe..." : "Create Recipe"}
              </button>

              {addRecipeMutation.isError && (
                <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
                  Failed to create recipe.
                  {addRecipeMutation.error?.response?.data?.message && (
                    <div>Error: {addRecipeMutation.error.response.data.message}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarToDoRecipe;