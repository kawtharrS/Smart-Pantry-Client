import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Recipe {
  household_id:number;
  user_id:number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
}

const BarToDoRecipe = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    prep_time_min: "",
    cook_time_min: "",
    serving: "",
  });

  const addIngredientMutation = useMutation({
      mutationFn: async (data: Recipe) => {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/recipe/add",
          data
        );
        return response.data;
      },
      onSuccess: (result) => {
        console.log("Ingredient added:", result);
        setNewRecipe({ title: "", description: "", prep_time_min: "", cook_time_min: "", serving: ""});
        setIsModalOpen(false);
      },
      onError: (error) => console.error("Failed to add ingredient:", error),
    });

  const handleAddIngredient = () => {
    const dataIng: Recipe = {
      household_id: 1,
      user_id:1,
      title: newRecipe.title,
      description: newRecipe.description,
      prep_time_min: parseInt(newRecipe.prep_time_min),
      cook_time_min: parseInt(newRecipe.cook_time_min),
      serving:parseInt(newRecipe.serving),
    };

    addIngredientMutation.mutate(dataIng);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields = [
    { name: "prep_time_min", label: "Time to Prepare" },
    { name: "cook_time_min", label: "Time to cook" },
    { name: "serving", label:"Serving"},

  ];

  return (
    <>
      <div className="flex fixed rounded-r-2xl top-20 left-64 p-3 bg-gray-400 backdrop-blur-md shadow-md w-[calc(100%-16rem)] z-40 justify-between">
        <h2 className="p-2 font-bold text-xl flex-1">Create your own Recipe List</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="!bg-white shadow-md px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-black font-black text-3xl"
        >
          +
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 overflow-y-auto max-h-[80vh] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-emerald-900">Add New Ingredient</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-50 text-2xl">
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <input
                  type="text"
                  name="title"
                  value={newRecipe.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="e.g., Tomato, Chicken Breast"
                />
              </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Description</label>
                <input
                  type="text"
                  name="description"
                  value={newRecipe.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="note about the recipe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="number"
                      name={field.name}
                      value={newRecipe[field.name as keyof typeof newRecipe]}
                      onChange={handleInputChange}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                      placeholder="0"
                    />
                  </div>
                  
                  
                ))}

              </div>

              

              <button
                onClick={handleAddIngredient}
                className={`w-full bg-amber-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors 
                }`}
              >
                Add Recipe 
              </button>

              {addIngredientMutation.isError && (
                <p className="text-red-600 text-sm mt-2">Failed to add ingredient. Try again.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarToDoRecipe;
