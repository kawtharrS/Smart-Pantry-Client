import Navbar from '../components/NavbarHousehold';
import WeekCard from '../components/WeekCard';

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function WeeklyPlan() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center w-screen mt-20">    
        <h1 className="text-green-800 mb-10 font-black">Weekly Meal Plan</h1>    
        <div className="flex flex-wrap justify-center gap-15 w-full max-w-10/12">
          {daysOfWeek.map((day) => (
            <WeekCard key={day} day={day} />
          ))}
        </div>
      </div>
    </>
  );
}

export default WeeklyPlan;