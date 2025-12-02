import { useQuery } from "@tanstack/react-query";
import { getWeeklyShoppingList } from "../components/shoppingListApi";

export default function WeeklyShoppingList({ householdId }: { householdId: number }) {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["weekly-shopping-list", householdId],
    queryFn: () => getWeeklyShoppingList(householdId)
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load shopping list.</p>;

  const items = data?.payload ?? [];

  return (
    <div>
      <h1>Weekly Shopping List</h1>

      {items.length === 0 && (
        <p>No missing ingredients. You're fully stocked!</p>
      )}

      {items.map((ingredient: any) => (
        <div key={ingredient.id}>
          <p>
            {ingredient.name} — need {ingredient.quantity_needed}
          </p>
        </div>
      ))}
    </div>
  );
}
