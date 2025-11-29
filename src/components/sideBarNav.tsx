
const SideBar = () => {

  return (
    <nav className="fixed left-0 top-20 h-screen w-64 bg-white/30 backdrop-blur-md shadow-md z-20">
      <div className="flex flex-col h-full p-4">

        <ul className="flex flex-col space-y-4 font-medium flex-1 mt-20">
          <li>
            <a href="#" className="flex items-center !text-gray-700 text-xl hover:text-amber-500 transition-colors p-3 rounded-lg hover:bg-white/50">
              <span className="ml-2">Week 1</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center !text-gray-700 text-xl hover:text-amber-500 transition-colors p-3 rounded-lg hover:bg-white/50">
              <span className="ml-2">Week2</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center !text-gray-700 text-xl hover:text-amber-500 transition-colors p-3 rounded-lg hover:bg-white/50">
              <span className="ml-2">Week 3</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;