import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Ingredient {
  name: string;
  unit_id: number;
  caloriesPer100g: string;
  proteinPer100g: string;
  fatsPer100g: string;
  carbsPer100g: string;
}

const BarToDo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    calories: "",
    protein: "",
    fats: "",
    carbs: "",
  });

  const addIngredientMutation = useMutation({
      mutationFn: async (data: Ingredient) => {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/ingredient/add",
          data
        );
        return response.data;
      },
      onSuccess: (result) => {
        console.log("Ingredient added:", result);
        setNewIngredient({ name: "", calories: "", protein: "", fats: "", carbs: "" });
        setIsModalOpen(false);
      },
      onError: (error) => console.error("Failed to add ingredient:", error),
    });

  const handleAddIngredient = () => {
    const dataIng: Ingredient = {
      name: newIngredient.name,
      unit_id: 1,
      caloriesPer100g: newIngredient.calories,
      proteinPer100g: newIngredient.protein,
      fatsPer100g: newIngredient.fats,
      carbsPer100g: newIngredient.carbs,
    };

    addIngredientMutation.mutate(dataIng);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields = [
    { name: "calories", label: "Calories (per 100g)" },
    { name: "protein", label: "Protein (g)" },
    { name: "fats", label: "Fats (g)" },
    { name: "carbs", label: "Carbs (g)" },
  ];

  return (
    <>
      <div className="flex fixed rounded-r-2xl top-20 left-64 p-3 bg-gray-400 backdrop-blur-md shadow-md w-[calc(100%-16rem)] z-40 justify-between">
        <h2 className="p-2 font-bold text-xl flex-1">Create your own Item List</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredient Name</label>
                <input
                  type="text"
                  name="name"
                  value={newIngredient.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="e.g., Tomato, Chicken Breast"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="number"
                      name={field.name}
                      value={newIngredient[field.name as keyof typeof newIngredient]}
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
                Add Ingredient 
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

export default BarToDo;
