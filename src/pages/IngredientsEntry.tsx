import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/NavbarHousehold";
import BarToDoIngredients from "../components/BarToDoIngredients";
import CardIngredient from "../components/CardIngredient";
import { api } from "../apis/dashboard";
import { useAuth } from "../context/AuthContext";
import type { Ingredient, ApiResponse } from "../types";

const IngredientsEntry = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery<ApiResponse>({
    queryKey: ["Ingredient"],
    queryFn: async () => {
      const res = await api.get("/ingredient/", { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    },
    retry: 1,
  });

  const deleteIngredient = useMutation({
    mutationFn: (id: number) => api.get(`/ingredient/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Ingredient"] }),
  });

  const onclick = (id: number) => {
    if (window.confirm("Are you sure you want to remove this ingredient?")) deleteIngredient.mutate(id);
  };

  const transformApiData = (apiData: ApiResponse["payload"]): Ingredient[] => {
    if (!apiData) return [];
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

  const cardsData = transformApiData(data?.payload || []);

  return (
    <section className="flex flex-col min-h-screen bg-gray-50 w-screen">
      <Navbar />

      <div className=" w-screen">
        <BarToDoIngredients />

        {isPending && (
          <div className="p-6 mt-60 flex items-center justify-center text-lg">
            Loading ingredients...
          </div>
        )}
        {error && (
          <div className="p-6 mt-24 flex items-center justify-center min-h-[50vh] text-center text-red-500">
            <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
            <p>{(error as Error).message}</p>
          </div>
        )}

        <div className="p-6 mt-40">
          {cardsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No ingredients found.</div>
          ) : (
            <div className="flex flex-wrap gap-6 justify-center">
              {cardsData.map((card) => (
                <CardIngredient key={card.id} {...card} onClick={onclick} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IngredientsEntry;
