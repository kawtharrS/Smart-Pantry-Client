import { useQuery } from '@tanstack/react-query';
import SideBar from '../components/sideBarNav';
import Navbar from '../components/NavbarHousehold';
import BarToDoRecipe from '../components/BarToDoRecipe';
import CardRecipe from '../components/CardRecipe';
import axios from "axios";
import type {Recipe,ApiResponseRecipe,IngredientRecipe} from '../types';


function RecipeEntry() {
  const {
    data: ingredientsData,
    isPending: ingredientsLoading,
    error: ingredientsError
  } = useQuery<{ payload: IngredientRecipe[] }>({
    queryKey: ["ingredientsData"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/ingredient/");
      return response.data;
    },
  });

  const onclick = async (id: number) => {
    alert("item deleted");
    await axios.get(`http://127.0.0.1:8000/api/recipe/delete/${id}`);
  }

  const { isPending, error, data } = useQuery<ApiResponseRecipe>({
    queryKey: ["recipeData"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/recipe/");
      
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

  const transformApiData = (apiData: ApiResponseRecipe['payload']): Recipe[] => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map((item) => {
      const ingredientsFromItem = (item as any).ingredients ?? [];
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        prep_time_min: item.prep_time_min,
        cook_time_min: item.cook_time_min,
        serving: item.serving,
        household_id: item.household_id ?? 0,
        user_id: item.user_id ?? 0,
        ingredients: ingredientsFromItem,
        textColor: "text-amber-600"
      };
    });
  };

  const cardsData = transformApiData(data?.payload || []);
  const ingredients = ingredientsData?.payload || [];
  
  const householdId = 1; 
  const userId = 1; 

  if (isPending || ingredientsLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SideBar />
      <main className="ml-64 pt-20">
        <BarToDoRecipe 
          ingredients={[]}
          householdId={householdId}
          userId={userId}
        />
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg">Loading Recipes...</div>
          </div>
        </div>
      </main>
    </div>
  );

  if (error || ingredientsError) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SideBar />
      <main className="ml-64 pt-20">
        <BarToDoRecipe 
          ingredients={ingredients}
          householdId={householdId}
          userId={userId}
        />
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-500 text-center">
              <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
              <p>{error?.message || ingredientsError?.message}</p>
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
        <BarToDoRecipe 
          ingredients={ingredients}
          householdId={householdId}
          userId={userId}
        />
        
        <div className="p-8 mt-15">
          {cardsData.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <h2 className="text-xl font-bold mb-2">No Recipes Yet</h2>
                <p>Start by adding your first recipe!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-fit">
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
  );
}

export default RecipeEntry;