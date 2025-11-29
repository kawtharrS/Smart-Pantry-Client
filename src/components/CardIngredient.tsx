import { Link } from 'react-router-dom';

interface CardIngredientProps {
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  bgColor?: string;
  textColor?: string;
}

const CardIngredient = ({ 
  name,
  calories,
  fats,
  carbs,
  protein,
  textColor = "text-amber-600" 
}: CardIngredientProps) => {
  return (
    <Link to="/ingEntry" className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 w-80 `}>
      <div className="flex flex-col items-center text-center">
        <h2 className={`text-xl font-bold ${textColor} capitalize mb-4`}>{name}</h2>
        
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-800">{calories}</div>
          <div className="text-sm text-gray-500 font-medium">CALORIES</div>
        </div>

        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{fats}g</div>
            <div className="text-xs text-gray-500">Fats</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{carbs}g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">{protein}g</div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardIngredient;