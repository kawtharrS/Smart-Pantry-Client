import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Guide", href: "#guide" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed w-full top-0 left-0 p-1 bg-white/30 backdrop-blur-md shadow-md z-50">
      <div className="flex justify-between items-center p-4 mx-auto">
        <Link to="/" className="flex items-center space-x-1 text-3xl font-bold">
          <span className="text-amber-500">Home</span>
          <span className="text-emerald-600">Food</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded bg-amber-500 hover:bg-amber-400"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className="hidden md:flex space-x-8 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="!text-gray-700 text-2xl hover:text-amber-500 transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <Link
          to="/login"
          className="bg-amber-500 !text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Login
        </Link>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col space-y-2 px-4 pb-4 font-medium border-t">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="block py-2 !text-gray-700 hover:text-amber-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
