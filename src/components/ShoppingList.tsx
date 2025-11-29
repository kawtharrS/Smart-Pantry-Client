import { useState } from 'react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  completed: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Tomatoes', quantity: '5 pieces', category: 'Vegetables', completed: false },
    { id: '2', name: 'Chicken Breast', quantity: '500g', category: 'Meat', completed: true },
    { id: '3', name: 'Pasta', quantity: '250g', category: 'Grains', completed: false }
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedItems = items.filter(item => item.completed);
  const pendingItems = items.filter(item => !item.completed);

  return (
    <div className="bg-white p-10 rounded-lg shadow-md top-30">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Shopping List</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">To Buy</h3>
        {pendingItems.length === 0 ? (
          <p className="text-gray-500 text-center py-2">All items purchased!</p>
        ) : (
          <div className="space-y-2">
            {pendingItems.map(item => (
              <div key={item.id} className="flex items-center p-3 bg-amber-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="mr-3 h-5 w-5 text-amber-500 rounded focus:ring-amber-400"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{item.name}</span>
                  <span className="text-sm text-gray-600 ml-2">({item.quantity})</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {completedItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Purchased</h3>
          <div className="space-y-2">
            {completedItems.map(item => (
              <div key={item.id} className="flex items-center p-3 bg-green-50 rounded-lg opacity-75">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="mr-3 h-5 w-5 text-green-500 rounded focus:ring-green-400"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-600 line-through">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2 line-through">({item.quantity})</span>
                </div>
                <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
        Generate from Meal Plan
      </button>
    </div>
  );
};

export default ShoppingList;