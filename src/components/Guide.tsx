const Guide = () => {
  return (
    <div className="relative flex h-11/12 w-full mt-8 mb-30 overflow-hidden z-0 justify-center items-center">

      <div className="w-2 font-black text-black z-10 pl-15 mt-20">
        <h1>Your Guide</h1>
      </div>

      <div className="flex justify-end w-full">
        
        <div className="rounded-l-full bg-amber-500 w-3/4 h-80 p-10 
                        flex flex-col justify-center">

          <div className="grid grid-cols-3 gap-4 place-items-end text-white font-bold text-xl">

            <div className="bg-white/20 w-full text-center p-4 rounded-xl backdrop-blur-sm">
              1. Add your Pantry items
            </div>
            <div className="bg-white/20 w-full text-center p-4 rounded-xl backdrop-blur-sm">
              2. Track expiry dates
            </div>
            <div className="bg-white/20 w-full text-center p-4 rounded-xl backdrop-blur-sm">
              3. Get smart suggestions
            </div>
            <div className="bg-white/20 w-full text-center p-4 rounded-xl backdrop-blur-sm">
              4. Auto-generate meals
            </div>
            <div className="bg-white/20 w-full text-center p-4 rounded-xl backdrop-blur-sm">
              5. Manage weekly shopping
            </div>
            <div className="bg-white/20 w-full text-center p-4 rounded-xl backdrop-blur-sm">
              6. Reduce waste
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Guide;
