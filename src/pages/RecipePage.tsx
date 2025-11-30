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
  
  const onclick=async (id:number)=>{
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
        textColor: "text-gray-600"
      };
    });
  };



  if (isPending) return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDoRecipe />
        <div className="p-6 mt-40">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg">Loading Recipes...</div>
          </div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="flex w-screen">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDoRecipe />
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
        <BarToDoRecipe />
        
        <div className="p-6 w-screen">
          <div className="mt-35">
            {cardsData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No Recipes found.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
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
        </div>
      </div>

      
    </section>
  );
}

export default RecipeEntry;