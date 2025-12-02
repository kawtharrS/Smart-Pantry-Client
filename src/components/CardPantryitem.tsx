interface CardPantryItemProps {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
  location?: string;
  textColor?: string;
  onClick?: (id: number) => void;
}

const CardPantryItem = ({
  id,
  name,
  quantity,
  expiry_date,
  location,
  textColor = "text-amber-600",
  onClick,
}: CardPantryItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(id);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300 w-80 cursor-pointer block"
    >
      <h2 className={`text-xl font-bold ${textColor} capitalize mb-4`}>{name}</h2>
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-800">{quantity}</div>
          <div className="text-gray-500">Quantity</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-800">
            {expiry_date ? new Date(expiry_date).toLocaleDateString() : "N/A"}
          </div>
          <div className="text-gray-500">Expires</div>
        </div>
        {location && (
          <div className="text-center">
            <div className="font-semibold text-gray-800">{location}</div>
            <div className="text-gray-500">Location</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPantryItem;
