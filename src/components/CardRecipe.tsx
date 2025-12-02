import { useState } from "react";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';

interface CardRecipeProps {
  id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  textColor?: string;
  onClick?: (id: number) => void;
  ingredients?: RecipeIngredient[];
}

interface RecipeInstruction {
  id: number;
  recipe_id: number;
  stepNb: number;
  instruction: string;
  created_at: string;
  updated_at: string;
}

interface RecipeIngredient {
  id: number;
  name: string;
  unit_id: number;
  caloriesPer100g: string;
  proteinPer100g: string;
  fatPer100g: string;
  carbsPer100g: string;
}

interface Recipe {
  id: number;
  household_id: number;
  user_id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  ingredients: RecipeIngredient[];
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  status: string;
  payload: T[];
}

const useRecipeInstructions = (recipe_id: number) => {
  return useQuery({
    queryKey: ["recipeInstructions", recipe_id],
    queryFn: async (): Promise<RecipeInstruction[]> => {
      const response = await axios.get("http://127.0.0.1:8000/api/recipeInstruction/recipeInstructions");
      if (!response) {
        throw new Error("HTTP Error!");
      }
      const result: ApiResponse<RecipeInstruction> = response.data;
      return result.payload.filter(instruction => instruction.recipe_id === recipe_id)
        .sort((a, b) => a.stepNb - b.stepNb);
    },
    retry: 1,
  });
};

const useRecipeWithIngredients = (recipe_id: number) => {
  return useQuery({
    queryKey: ["recipeWithIngredients", recipe_id],
    queryFn: async (): Promise<RecipeIngredient[]> => {
      const response = await axios.get("http://127.0.0.1:8000/api/recipe/");
      if (!response) {
        throw new Error("HTTP Error!");
      }
      const result: ApiResponse<Recipe> = response.data;
      const recipe = result.payload.find(r => r.id === recipe_id);
      return recipe?.ingredients || [];
    },
    retry: 1,
  });
};

const IngredientsModalContent = ({
  title,
  description,
  ingredients
}: {
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
}) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Recipe Name</p>
        <p className="text-lg font-semibold text-gray-900">{title}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
        <p className="text-gray-700">{description}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Ingredients</p>
        {ingredients.length === 0 ? (
          <p className="text-gray-500 italic">No ingredients available</p>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{ingredient.name}</span>
                <span className="text-gray-600">
                  {ingredient.caloriesPer100g} cal/100g
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InstructionsModalContent = ({
  title,
  instructions
}: {
  title: string;
  instructions: RecipeInstruction[];
}) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Recipe Name</p>
        <p className="text-lg font-semibold text-gray-900">{title}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Cooking Instructions</p>
        {instructions.length === 0 ? (
          <p className="text-gray-500 italic">No instructions available</p>
        ) : (
          <div className="space-y-4">
            {instructions.map((instruction) => (
              <div key={instruction.id} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {instruction.stepNb}
                </div>
                <p className="flex-1 text-gray-700 pt-1">{instruction.instruction}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Modal = ({
  isOpen,
  onClose,
  type,
  children
}: {
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
  type: 'ingredients' | 'instructions';
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'ingredients' ? 'Recipe Ingredients' : 'Cooking Instructions'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const CardRecipe = ({
  id,
  title,
  description,
  prep_time_min,
  cook_time_min,
  serving,
  textColor = "text-amber-600",
  ingredients: propsIngredients, 
}: CardRecipeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'ingredients' | 'instructions'>('instructions');

  const { data: instructions = [] } = useRecipeInstructions(id);
  
  const { data: fetchedIngredients = [] } = useRecipeWithIngredients(id);
  const ingredients = propsIngredients || fetchedIngredients;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button')) {
      window.location.href = `/recipe/${id}`;
    }
  };

  const openModal = (type: 'ingredients' | 'instructions') => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(false);
  };

  const renderModalContent = () => {
    if (modalType === 'ingredients') {
      return (
        <IngredientsModalContent
          title={title}
          description={description}
          ingredients={ingredients}
        />
      );
    }
    return (
      <InstructionsModalContent
        title={title}
        instructions={instructions}
      />
    );
  };

  return (
    <>
      <div className="h-full">
        <div 
          className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="p-5 flex-1 flex flex-col">
            <div>
              <h3 className={`text-xl font-bold ${textColor} mb-2 line-clamp-2`}>
                {title}
              </h3>
            </div>

            <div className="mb-3 flex-1">
              <p className="text-xs font-semibold text-gray-700 mb-1">Description:</p>
              <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3 py-3 border-t border-gray-200">
              <div className="text-center">
                <p className="text-base font-bold text-red-400">{prep_time_min}min</p>
                <p className="text-xs text-gray-500 mt-0.5">Prep Time</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-green-500">{cook_time_min}min</p>
                <p className="text-xs text-gray-500 mt-0.5">Cook Time</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-blue-400">{serving}/person</p>
                <p className="text-xs text-gray-500 mt-0.5">Serving</p>
              </div>
            </div>

            <div className="flex gap-2 mt-auto pt-2 relative z-10">
            <div className="flex flex-col w-full mt-auto pt-2 gap-2">
              <button
                onClick={openModal('ingredients')}
                className="w-full !bg-amber-500 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 text-sm text-center"
              >
                Ingredients
              </button>
              <button
                onClick={openModal('instructions')}
                className="w-full !bg-gray-400 hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition-colors duration-200 text-sm text-center"
              >
                Instructions
              </button>
            </div>

                        </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} type={modalType}>
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default CardRecipe;