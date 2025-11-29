import { useState } from 'react';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: string;
  unit: string;
}

const IngredientManager = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Tomatoes', category: 'Vegetables', quantity: '5', unit: 'pieces' },
    { id: '2', name: 'Chicken Breast', category: 'Meat', quantity: '500', unit: 'grams' },
    { id: '3', name: 'Pasta', category: 'Grains', quantity: '250', unit: 'grams' }
  ]);

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: 'Vegetables',
    quantity: '',
    unit: 'pieces'
  });

  const categories = ['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Grains', 'Spices', 'Other'];

  const handleAddIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.quantity.trim()) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        ...newIngredient
      };
      setIngredients([...ingredients, ingredient]);
      setNewIngredient({ name: '', category: 'Vegetables', quantity: '', unit: 'pieces' });
    }
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Manage Ingredients</h2>
      
      {/* Add Ingredient Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Ingredient</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Ingredient name"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          
          <select
            value={newIngredient.category}
            onChange={(e) => setNewIngredient({...newIngredient, category: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Quantity"
            value={newIngredient.quantity}
            onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          
          <select
            value={newIngredient.unit}
            onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="pieces">pieces</option>
            <option value="grams">grams</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="liters">liters</option>
            <option value="cups">cups</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
          </select>
        </div>
        <button
          onClick={handleAddIngredient}
          className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Add Ingredient
        </button>
      </div>

      {/* Ingredients List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Ingredients</h3>
        {ingredients.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No ingredients added yet</p>
        ) : (
          <div className="space-y-2">
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold text-gray-800">{ingredient.name}</span>
                  <span className="text-sm text-gray-600 ml-2">({ingredient.category})</span>
                  <span className="text-sm text-amber-600 ml-2">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientManager;