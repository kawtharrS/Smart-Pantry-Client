import { Link } from 'react-router-dom';

interface CardMainHouseholdProps {
  title: string;
  description: string;
  bgColor?: string;
  textColor?: string;
}

const CardMainHousehold = ({ 
  title, 
  description, 
  bgColor = "bg-white", 
  textColor = "text-amber-600" 
}: CardMainHouseholdProps) => {
  return (
    <Link to="/ingEntry" className={`${bgColor} p-6 rounded-lg shadow-md h-full`}>
      <h2 className={`text-xl font-semibold ${textColor} mb-3`}>{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default CardMainHousehold;