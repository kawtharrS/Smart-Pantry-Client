import { useQuery } from "@tanstack/react-query";
import { getAllShoppingLists } from "./shoppingListApi";

export default function ShoppingListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["shopping-lists"],
    queryFn: getAllShoppingLists
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Shopping Lists</h1>
      {data.payload.map((item: any) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  );
}
