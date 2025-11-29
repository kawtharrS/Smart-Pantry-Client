import { Link } from 'react-router-dom';


const Choose = () => {
  return (
    <section className="min-h-screen w-screen  bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md bg-white flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg p-10">
        <Link to="/" className="self-start mb-4 !text-gray-600 hover:text-amber-500 transition-colors flex items-center">
          ← Back to Home
        </Link>
        <h1 className="text-lg md:text-xl  text-emerald-800 font-bold">Choose to</h1>

        <Link to="/HouseholdMain" className = "w-full p-2 !bg-amber-500 rounded-xl mt-3 hover:bg-amber-600 !text-white text-center">Create a Household</Link>
        <button className = "w-full p-2 !bg-amber-500 rounded-xl mt-3 hover:bg-amber-600">Join a Household</button>


        </div>
        </section>
)
}

export default Choose;