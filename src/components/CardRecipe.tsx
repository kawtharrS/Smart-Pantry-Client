import { Link } from 'react-router-dom';

interface CardRecipeProps {
  id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  textColor?: string;
  onClick?: (id: number) => void; 
}

const CardRecipe = ({
  id,
  title,
  description,
  prep_time_min,
  cook_time_min,
  serving,
  textColor = "text-amber-600",
  onClick,
}: CardRecipeProps) => {
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
        <h2 className={`text-xl font-bold ${textColor} capitalize mb-4`}>{title}</h2>

        <div className="mb-4">
        <div className="text-sm text-gray-500 font-medium">Description:</div>
          <div className="text-3xl font-bold text-gray-800">{description}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 w-full">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{prep_time_min}min</div>
            <div className="text-xs text-gray-500">Preparation Time </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{cook_time_min}min</div>
            <div className="text-xs text-gray-500">Cook time min</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">{serving}/person</div>
            <div className="text-xs text-gray-500">Serving</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardRecipe;