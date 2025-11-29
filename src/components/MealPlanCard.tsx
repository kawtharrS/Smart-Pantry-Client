interface Meal {
  day: string;
  meal: string;
}

interface MealPlanCardProps {
  title: string;
  week: string;
  meals: Meal[];
}

const MealPlanCard = ({ title, week, meals }: MealPlanCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-emerald-800">{title}</h2>
        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">{week}</span>
      </div>
      
      <div className="space-y-3">
        {meals.map((meal, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700">{meal.day}</span>
            <span className="text-gray-600">{meal.meal}</span>
            <button className="text-amber-500 hover:text-amber-700 text-sm">
              Change
            </button>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
        Edit Meal Plan
      </button>
    </div>
  );
};

export default MealPlanCard;