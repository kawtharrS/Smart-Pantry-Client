import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import type { NewIngredientData } from "../types";
import { api } from "../apis/dashboard";

const BarToDoIngredients = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState<NewIngredientData>({
    name: "",
    unit_id: 1,
    caloriesPer100g: 0,
    proteinPer100g: 0,
    fatsPer100g: 0,
    carbsPer100g: 0,
    expiry_date: "",
    quantity: 0,
  });

  const addIngredientMutation = useMutation({
    mutationFn: async (data: NewIngredientData) => {
      const res = await api.post("/ingredient/add", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      setNewIngredient({
        name: "",
        unit_id: 1,
        caloriesPer100g: 0,
        proteinPer100g: 0,
        fatsPer100g: 0,
        carbsPer100g: 0,
        expiry_date: "",
        quantity: 0,
      });
      setIsModalOpen(false);
    },
    onError: (err) => console.error("Failed to add ingredient:", err),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: name === "name" || name === "expiry_date" ? value : Number(value),
    }));
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name) return alert("Ingredient name is required");
    addIngredientMutation.mutate(newIngredient);
  };

  return (
    <>
      <div className="flex fixed rounded-r-2xl top-20 p-3 bg-amber-500 backdrop-blur-md shadow-md w-fit z-40 justify-between">
        <h2 className="p-2 font-bold text-xl flex-1">Add Ingredient</h2>
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
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {["name", "caloriesPer100g", "proteinPer100g", "fatsPer100g", "carbsPer100g", "expiry_date"].map((field) => {
                const type = field === "name" ? "text" : field === "expiry_date" ? "date" : "number";

                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === "name" ? "Name *" : field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={type}
                      name={field}
                      value={(newIngredient as any)[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                      placeholder={field === "name" ? "Ingredient name" : undefined}
                    />
                  </div>
                );
              })}

              <button
                onClick={handleAddIngredient}
                disabled={addIngredientMutation.isPending || !newIngredient.name}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                {addIngredientMutation.isPending ? "Adding..." : "Add Ingredient"}
              </button>

              {addIngredientMutation.isError && (
                <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
                  Failed to add ingredient.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarToDoIngredients;
