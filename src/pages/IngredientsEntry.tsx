import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SideBar from '../components/sideBarNav';
import Navbar from '../components/NavbarHousehold';
import BarToDoIngredients from '../components/BarToDoIngredients';
import CardIngredient from '../components/CardIngredient';
import axios from "axios";
import type {Ingredient, ApiResponse} from '../types';
import { useAuth } from '../context/AuthContext';

function IngredientsEntry() {

  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { isPending, error, data } = useQuery<ApiResponse>({
    queryKey: ["Ingredient"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/v0.1/ingredient/", {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  });
      if (!response) throw new Error("HTTP error!");
      return response.data;
    },
    retry: 1,
  });

  const deleteIngredient = useMutation({
    mutationFn: async (id: number) => {
      return await axios.get(`http://127.0.0.1:8000/api/v0.1/ingredient/delete/${id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Ingredient'] });
    },
  });

  const onclick = (id: number) => {
    if (window.confirm('Are you sure you want to remove this recipe?')) {
      deleteIngredient.mutate(id);
    }
  };

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
