import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface PantryItem {
  household_id: number;    
  ingredient_id: number;  
  unit_id: number;
  quantity:number,
  location?: string;
  expiry_date?: string;
}

interface BarToDoProps {
  ingredients: { id: number; name: string }[];
  householdId: number;
}

const BarToDo = ({ ingredients }: BarToDoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPantryItem, setNewPantryItem] = useState({
    ingredient_id: 0,  
    quantity: "",
    unit_id: 1,
    location: "",
    expiry_date: "",
  });

  const addPantryItemMutation = useMutation({
    mutationFn: async (data: PantryItem) => {
      console.log("Sending to backend:", data);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/pantryItem/add",
        data
      );
      return response.data;
    },
    onSuccess: (result) => {
      console.log("Pantry Item added:", result);
      setNewPantryItem({ 
        ingredient_id: 0, 
        quantity: "", 
        unit_id: 1, 
        location: "", 
        expiry_date: "" 
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleAddPantryItem = () => {
    if (newPantryItem.ingredient_id === 0) {
      alert("Please select an ingredient");
      return;
    }

    if (!newPantryItem.quantity || Number(newPantryItem.quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    addPantryItemMutation.mutate({
      household_id: 1, 
      ingredient_id: newPantryItem.ingredient_id, 
      quantity: Number(newPantryItem.quantity),
      unit_id: newPantryItem.unit_id,
      location: newPantryItem.location || "",
      expiry_date: newPantryItem.expiry_date,
    });
  };
    const navigate = useNavigate();

    const handleIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      if (value === "add-new") {
        navigate("/ingEntry"); // go to ingredient page
      } else {
        setNewPantryItem((prev) => ({
          ...prev,
          ingredient_id: Number(value), // update selected ingredient
        }));
      }
    };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'unit_id') {
      setNewPantryItem((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (name === 'ingredient_id') {
      setNewPantryItem((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setNewPantryItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <div className="flex fixed rounded-r-2xl top-20 left-64 p-3 bg-gray-400 backdrop-blur-md shadow-md w-[calc(100%-16rem)] z-40 justify-between">
        <h2 className="p-2 font-bold text-xl flex-1">Add Pantry Item</h2>
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
              <h3 className="text-xl font-black text-emerald-900">Add New Pantry Item</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredient <span className="text-red-500">*</span>
                </label>
                <select
                name="ingredient_id"
                value={newPantryItem.ingredient_id}
                onChange={handleIngredientChange} // handles both selecting and navigation
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                required
              >
                <option value={0}>Select Ingredient</option>
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
                <option value="add-new">Add new Ingredient</option>
              </select>

                {newPantryItem.ingredient_id === 0 && (
                  <p className="text-red-500 text-xs mt-1">Please select an ingredient</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={newPantryItem.quantity}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  name="unit_id"
                  value={newPantryItem.unit_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                >
                  <option value={1}>Kilograms (kg)</option>
                  <option value={2}>Gram (g)</option>
                  <option value={3}>Milliliters (ml)</option>
                  <option value={4}>Liters (L)</option>
                  <option value={5}>Pieces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={newPantryItem.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  placeholder="Pantry, Fridge, Freezer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={newPantryItem.expiry_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />
              </div>

              <button
                onClick={handleAddPantryItem}
                disabled={addPantryItemMutation.isPending || newPantryItem.ingredient_id === 0 || !newPantryItem.quantity}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                {addPantryItemMutation.isPending ? "Adding..." : "Add Pantry Item"}
              </button>

              {addPantryItemMutation.isError && (
                <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
                  Failed to add pantry item. 
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarToDo;