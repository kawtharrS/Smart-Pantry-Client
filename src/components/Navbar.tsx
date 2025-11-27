import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 left-0 p-1 bg-white/30 backdrop-blur-md shadow-md z-50">
      <div className="flex justify-between itemscenter- p-4 mx-auto">
        <a href="#" className="flex items-center space-x-1">
          <span className="text-3xl font-bold text-amber-500">Home</span>
          <span className="text-3xl font-bold text-emerald-600">Food</span>
        </a>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded !bg-amber-500 hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6  "
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className="hidden md:flex space-x-8 font-medium">
          <li><a href="#" className="!text-gray-700 text-2xl ">Home</a></li>
          <li><a href="#" className="!text-gray-700 text-2xl">Guide</a></li>
          <li><a href="#" className="!text-gray-700 text-2xl">Contact</a></li>
        </ul>
        <button className="!bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"> login</button>
      </div>

      {isOpen && (
        <ul className={`md:hidden flex flex-col space-y-2 px-4 pb-4 font-medium border-t transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <li><a href="#" className="block py-2  !text-gray-700">Home</a></li>
          <li><a href="#" className="block py-2  !text-gray-700">Guide</a></li>
          <li><a href="#" className="block py-2  !text-gray-700">Contact</a></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
