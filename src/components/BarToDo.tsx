import { Link } from 'react-router-dom';

const BarToDo = () => {

  return (
    <nav className="flex fixed rounded-r-2xl top-20 left-64 p-3 bg-gray-400 backdrop-blur-md shadow-md w-screen">
        <h2 className="p-2 font-bold  text-xl text-left">Create your own Item List</h2>
        <Link 
          to="/login"
          className="bg-gray-600 !text-white px-4 py-2 ml-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
+        </Link>
    </nav>
  );
};

export default BarToDo;