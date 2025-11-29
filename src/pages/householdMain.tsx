import Navbar from '../components/NavbarHousehold';
import CardMainHousehold from '../components/cardsMainHousehold';

function HouseholdMain() {
  const cardsData = [
    {
      title: "Household Members",
      description: "Manage your family members and their preferences.",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      title: "Ingredients Entry", 
      description: "Enter your Ingredients to the System.",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Recipes",
      description: "Browse and save your favorite recipes.", 
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    }
  ];

  return (
    <>
      <section>
        <Navbar />
        <div className="min-h-screen w-screen pt-20 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-emerald-800 text-center mb-8">Household Dashboard</h1>
            
            <div className="flex flex-wrap justify-center gap-6">
              {cardsData.map((card, index) => (
                <CardMainHousehold
                  key={index}
                  title={card.title}
                  description={card.description}
                  bgColor={card.bgColor}
                  textColor={card.textColor}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HouseholdMain;