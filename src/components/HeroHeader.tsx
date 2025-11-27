import saladImage from '../assets/salad.png';

const HeroHeader = () => {
  return (
    <div className="relative flex h-screen w-full p-20 mt-8 overflow-hidden">

      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl opacity-20 z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-20 z-10"></div>

      <div className="flex flex-col justify-center items-start w-1/2 font-black text-black z-20">
        <h1 className="text-4xl z-20 !bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-emerald-700">Smart Pantry & Meal Planner</h1>
        <h2 className="text-xl z-20">Ready to transform your household experience</h2>
        <button className="!bg-amber-500 w-1/3 text-white px-4 py-2 rounded-lg mt-4 hover:bg-amber-600 transition-colors">
          Get Started
        </button>
      </div>

      <div className="flex justify-center items-center w-1/2 z-20">
        <img src={saladImage} alt="Hero" className="max-w-full max-h-full" />
      </div>

    </div>
  );
};

export default HeroHeader;
