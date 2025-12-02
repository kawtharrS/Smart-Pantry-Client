import { useQuery } from '@tanstack/react-query';
import SideBar from '../components/sideBarNav';
import Navbar from '../components/NavbarHousehold';
import BarToDoIngredients from '../components/BarToDoIngredients';
import CardIngredient from '../components/CardIngredient';
import axios from "axios";

interface Ingredient {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  expiry_date: string;
  quantity: number;
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
    expiry_date: string;
    quantity: number;
    created_at: string;
    updated_at: string;
  }[];
}

function IngredientsEntry() {

  const onclick = async (id: number) => {
    alert("item deleted");
    await axios.delete(`http://127.0.0.1:8000/api/ingredient/delete/${id}`);
  }

  const { isPending, error, data } = useQuery<ApiResponse>({
    queryKey: ["ingredientData"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/ingredient/ingredients");
      if (!response) throw new Error("HTTP error!");
      return response.data;
    },
    retry: 1,
  });

  const transformApiData = (apiData: ApiResponse['payload']): Ingredient[] => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((item) => ({
      id: item.id,
      name: item.name,
      calories: item.caloriesPer100g,
      protein: item.proteinPer100g,
      fats: item.fatsPer100g,
      carbs: item.carbsPer100g,
      expiry_date: item.expiry_date,
      quantity: item.quantity,
      textColor: "text-gray-600",
    }));
  };

  if (isPending) return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDoIngredients />
        <div className="p-6 mt-40 flex items-center justify-center min-h-96">
          <div className="text-lg">Loading ingredients...</div>
        </div>
      </div>
    </section>
  );

  if (error) return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDoIngredients />
        <div className="p-6 mt-40 flex items-center justify-center min-h-96 text-center text-red-500">
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p>{(error as Error).message}</p>
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
        <BarToDoIngredients />

        <div className="p-6 w-screen mt-35">
          {cardsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No ingredients found.</div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {cardsData.map((card) => (
                <CardIngredient
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  calories={card.calories}
                  fats={card.fats}
                  carbs={card.carbs}
                  protein={card.protein}
                  quantity={card.quantity}
                  expiry_date={card.expiry_date}
                  textColor={card.textColor}
                  onClick={onclick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default IngredientsEntry;
