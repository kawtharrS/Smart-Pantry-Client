import { useState } from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 left-0 p-1 bg-white/30 backdrop-blur-md shadow-md z-50">
      <div className="flex justify-between items-center p-4 mx-auto">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-3xl font-bold text-amber-500">Home</span>
          <span className="text-3xl font-bold text-emerald-600">Food</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded bg-amber-500 hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className="hidden md:flex space-x-8 font-medium">
          <li>
            <Link to="/mealplan"  className="!text-gray-700 text-2xl hover:text-amber-500 transition-colors">
              Meal Plans
            </Link>
          </li>
          <li>
            <Link to="/list" className="!text-gray-700 text-2xl hover:text-amber-500 transition-colors">
              Shopping List
            </Link>
          </li>
          <li>
            <Link to="/items" className="!text-gray-700 text-2xl hover:text-amber-500 transition-colors">
              Ingredients
            </Link>
          </li>
          <li>
            <Link to="/recipeEntry" className="!text-gray-700 text-2xl hover:text-amber-500 transition-colors">
              Recipes
            </Link>
          </li>
        </ul>
        
        <Link 
          to="/login"
          className="bg-amber-500 !text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Logout
        </Link>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-2 px-4 pb-4 font-medium border-t transition-all duration-300">
          <li>
            <a 
              href="#home" 
              className="block py-2 text-gray-700 hover:text-amber-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#guide" 
              className="block py-2 text-gray-700 hover:text-amber-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Guide
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className="block py-2 text-gray-700 hover:text-amber-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;