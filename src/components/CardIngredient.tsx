import { Link } from 'react-router-dom';

interface CardIngredientProps {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  expiry_date: string;
  quantity: number;
  textColor?: string;
  onClick?: (id: number) => void; 
}

const CardIngredient = ({
  id,
  name,
  calories,
  fats,
  carbs,
  protein,
  expiry_date,
  quantity,
  textColor = "text-amber-600",
  onClick,
}: CardIngredientProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    onClick?.(id);     
  };

  return (
    <Link
      to="/ingEntry"
      onClick={handleClick}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 w-80 cursor-pointer block"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className={`text-xl font-bold ${textColor} capitalize mb-4`}>{name}</h2>

        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-800">{calories}</div>
          <div className="text-sm text-gray-500 font-medium">CALORIES</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 w-full">
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

        <div className="flex justify-between w-full text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-800">{quantity}</div>
            <div className="text-gray-500">Quantity</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">
              {expiry_date ? new Date(expiry_date).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-gray-500">Expires</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardIngredient;