import SideBar from '../components/sideBarNav'
import Navbar from '../components/NavbarHousehold';
import BarToDo from '../components/barToDo';
import CardIngredient from '../components/CardIngredient';

function SideBarNav() {
  const cardsData = [
    {
      name: "tomato",
      calories: 50,
      fats: 20,
      carbs: 20,
      protein: 30,
      textColor: "text-amber-600"
    },
    {
      name: "chicken breast",
      calories: 165,
      fats: 3.6,
      carbs: 0,
      protein: 31,
      textColor: "text-emerald-600"
    },
    {
      name: "brown rice",
      calories: 112,
      fats: 0.8,
      carbs: 23,
      protein: 2.6,
      textColor: "text-blue-600"
    },
    {
      name: "avocado",
      calories: 160,
      fats: 15,
      carbs: 9,
      protein: 2,
      textColor: "text-green-600"
    },
    {
      name: "tomato",
      calories: 50,
      fats: 20,
      carbs: 20,
      protein: 30,
      textColor: "text-amber-600"
    },
    {
      name: "chicken breast",
      calories: 165,
      fats: 3.6,
      carbs: 0,
      protein: 31,
      textColor: "text-emerald-600"
    },
    {
      name: "brown rice",
      calories: 112,
      fats: 0.8,
      carbs: 23,
      protein: 2.6,
      textColor: "text-blue-600"
    },
    {
      name: "avocado",
      calories: 160,
      fats: 15,
      carbs: 9,
      protein: 2,
      textColor: "text-green-600"
    },
        {
      name: "chicken breast",
      calories: 165,
      fats: 3.6,
      carbs: 0,
      protein: 31,
      textColor: "text-emerald-600"
    },
    {
      name: "brown rice",
      calories: 112,
      fats: 0.8,
      carbs: 23,
      protein: 2.6,
      textColor: "text-blue-600"
    },
    {
      name: "avocado",
      calories: 160,
      fats: 15,
      carbs: 9,
      protein: 2,
      textColor: "text-green-600"
    }
  ];

  return (
    <>
      <section>
        <SideBar />
        <div className="ml-64 min-h-screen bg-gray-50">
          <Navbar />
          <BarToDo />
          
          <div className="p-6 ">
            <div className="flex flex-wrap gap-6 mt-40">
              {cardsData.map((card, index) => (
                <CardIngredient
                  key={index}
                  name={card.name}
                  calories={card.calories}
                  fats={card.fats}
                  carbs={card.carbs}
                  protein={card.protein}
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

export default SideBarNav;