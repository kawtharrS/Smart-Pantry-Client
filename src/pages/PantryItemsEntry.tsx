import { useQuery } from "@tanstack/react-query";
import SideBar from "../components/sideBarNav";
import Navbar from "../components/NavbarHousehold";
import BarToDo from "../components/BarToDo";
import CardPantryItem from "../components/CardPantryitem";
import { api } from "../apis/dashboard";
import { useAuth } from "../context/AuthContext";
import { useHousehold } from "../context/HouseholdContext";
import type { PantryItem, PantryApiResponse, IngredientApiResponse } from "../types";

const PantryItemsEntry = () => {
  const { token } = useAuth();
  const { household } = useHousehold();

  const deletePantryItem = async (id: number) => {
    await api.get(`/pantryItem/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const { isPending, error, data } = useQuery<PantryApiResponse>({
    queryKey: ["pantryItems", household?.id],
    queryFn: async () => {
      const response = await api.get(`/pantryItem/?household_id=${household?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!household,
  });

  const { data: ingredientData } = useQuery<IngredientApiResponse>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const res = await api.get("/ingredient/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const transformPantryData = (apiData: PantryApiResponse["payload"]): PantryItem[] => {
    if (!apiData) return [];
    return apiData.map((item) => ({
      id: item.id,
      ingredient_id: item.ingredient.id,
      name: item.ingredient.name,
      quantity: item.quantity,
      expiry_date: item.expiry_date,
      location: item.location,
      textColor: "text-gray-600",
    }));
  };

  const cardsData = transformPantryData(data?.payload || []);

  return (
    <section className="flex">
      <SideBar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        <Navbar />
        <BarToDo ingredients={ingredientData?.payload || []} householdId={household?.id ?? 0} />
        {isPending && (
          <div className="p-6 mt-40 flex items-center justify-center min-h-96">
            <div className="text-lg">Loading pantry items...</div>
          </div>
        )}

        {error && (
          <div className="p-6 mt-40 flex items-center justify-center min-h-96 text-center text-red-500">
            <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
            <p>{(error as Error).message}</p>
          </div>
        )}

        <div className="p-6 w-screen mt-35">
          {cardsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pantry items found.</div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {cardsData.map((card) => (
                <CardPantryItem
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  quantity={card.quantity}
                  expiry_date={card.expiry_date}
                  location={card.location}
                  textColor={card.textColor}
                  onClick={deletePantryItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PantryItemsEntry;
