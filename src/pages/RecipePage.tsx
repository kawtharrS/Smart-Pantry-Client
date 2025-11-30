import { useQuery } from '@tanstack/react-query';
import SideBar from '../components/sideBarNav';
import Navbar from '../components/NavbarHousehold';
import BarToDoRecipe from '../components/BarToDoRecipe';
import CardRecipe from '../components/CardRecipe';
import axios from "axios";

interface Recipe {
  id: number;
  title: string;
  description: string;
  prep_time_min: number;
  cook_time_min: number;
  serving: number;
  textColor?: string;
}

interface ApiResponse {
  status: string;
  payload: {
    id: number;
    household_id: number;
    user_id: number;
    title: string;
    description: string;
    prep_time_min: number;
    cook_time_min: number;
    serving: number;
    created_at: string;
    updated_at: string;
  }[];
}

function RecipeEntry() {
  
  const onclick = async (id: number) => {
    alert("item deleted");
    await axios.get(`http://127.0.0.1:8000/api/recipe/delete/${id}`);
  }

  const { isPending, error, data } = useQuery<ApiResponse>({
    queryKey: ["ingredientData"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/recipe/recipes");
      
      if (!response) {
        throw new Error(`HTTP error!`);
      }
      
      const result = await response.data;
      console.log('API Response data', result);
      console.log('Payload:', result.payload);
      return result;
    },
    retry: 1,
  });

  const transformApiData = (apiData: ApiResponse['payload']): Recipe[] => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map((item) => {
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        prep_time_min: item.prep_time_min,
        cook_time_min: item.cook_time_min,
        serving: item.serving,
        textColor: "text-amber-600"
      };
    });
  };

  const cardsData = transformApiData(data?.payload || []);

  if (isPending) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SideBar />
      <main className="ml-64 pt-20">
        <BarToDoRecipe />
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg">Loading Recipes...</div>
          </div>
        </div>
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SideBar />
      <main className="ml-64 pt-20">
        <BarToDoRecipe />
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-500 text-center">
              <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      <Navbar />
      <SideBar />
      
      <main className="ml-64 pt-20">
        <BarToDoRecipe />
        
        <div className="p-8 mt-15">
          {cardsData.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <h2 className="text-xl font-bold mb-2">No Recipes Yet</h2>
                <p>Start by adding your first recipe!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-cols-1 md:flex-cols-2 lg:flex-cols-3 xl:flex-cols-4 gap-6">
              {cardsData.map((card) => (
                <CardRecipe
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  prep_time_min={card.prep_time_min}
                  cook_time_min={card.cook_time_min}
                  serving={card.serving}
                  textColor={card.textColor}
                  onClick={onclick}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );}

export default RecipeEntry;