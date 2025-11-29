import { useQuery } from '@tanstack/react-query';
import SideBar from '../components/sideBarNav';
import Navbar from '../components/NavbarHousehold';
import BarToDo from '../components/BarToDo';
import CardIngredient from '../components/CardIngredient';

interface Ingredient {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  textColor?: string;
}

interface ApiResponse {
  status: string;
  payload: {
    id: number;
    unit_id: number;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    fatsPer100g: number;
    carbsPer100g: number;
    created_at: string;
    updated_at: string;
  }[];
}

function IngredientsEntry() {
  const { isPending, error, data } = useQuery<ApiResponse>({
    queryKey: ["ingredientData"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/api/ingredient/ingredients");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response data', result);
      console.log('Payload:', result.payload);
      return result;
    },
    retry: 1,
  });

  const transformApiData = (apiData: ApiResponse['payload']): Ingredient[] => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map((item) => {
      return {
        id: item.id,
        name: item.name,
        calories: item.caloriesPer100g,
        protein: item.proteinPer100g,
        fats: item.fatsPer100g,
        carbs: item.carbsPer100g,
        textColor:"text-gray-600"
      };
    });
  };

  if (isPending) return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDo />
        <div className="p-6 mt-40">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg">Loading ingredients...</div>
          </div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDo />
        <div className="p-6 mt-40">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-500 text-center">
              <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const cardsData = transformApiData(data?.payload || []);

  return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDo />
        
        <div className="p-6">
          <div className="mt-20 w-screen ">
            <h2 className="text-2xl font-bold mb-6">
              Available Ingredients {data?.payload && `(${cardsData.length})`}
            </h2>
            
            {cardsData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No ingredients found.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {cardsData.map((card) => (
                  <CardIngredient
                    key={card.id}
                    name={card.name}
                    calories={card.calories}
                    fats={card.fats}
                    carbs={card.carbs}
                    protein={card.protein}
                    textColor={card.textColor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default IngredientsEntry;