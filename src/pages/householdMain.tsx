import Navbar from '../components/NavbarHousehold';
import CardMainHousehold from '../components/cardsMainHousehold';

function HouseholdMain() {

  return (
    <>
      <section>
        <Navbar />

        <div className="min-h-screen w-screen pt-20 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-emerald-800 text-center mb-8">
              Household Dashboard
            </h1>
            <div className="max-w-screen">
              <CardMainHousehold />
            </div>
          </div>
        </div>

      </section>
    </>
  );
}

export default HouseholdMain;
