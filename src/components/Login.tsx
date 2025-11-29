import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  return (
    <section className="min-h-screen w-screen  bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md bg-white flex flex-col items-center gap-3 rounded-xl shadow-lg p-8 mx-4">
        <Link to="/" className="self-start mb-4 !text-gray-600 hover:text-amber-500 transition-colors flex items-center">
          ← Back to Home
        </Link>
        
        <h1 className="text-lg md:text-xl text-emerald-800 font-bold">Welcome Back</h1>
        <p className="text-xs md:text-sm text-gray-500 text-center">
          Don't have an account? <span className="text-amber-500 cursor-pointer">Sign up</span>
        </p>

        <div className="w-full flex flex-col gap-3 mt-3">
          <div className="w-full flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
            <MdAlternateEmail className="text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200 relative">
            <FaFingerprint className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-700 placeholder-gray-400"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>

        <Link to="/choose" className="w-full p-3 bg-amber-500 !text-white text-center rounded-xl mt-6 hover:bg-amber-600 transition-colors font-medium">
          Login
        </Link>
      </div>
    </section>
  );
};

export default Login;