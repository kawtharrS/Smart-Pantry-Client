import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";


const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordView = () => setShowPassword(!showPassword);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md bg-white flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg p-10">
        <h1 className="text-lg md:text-xl  text-emerald-800 font-bold">Welcome</h1>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center gap-2 bg-gray-300 p-2 rounded-xl">
            <FaFingerprint />
            <input
              type="text"
              placeholder="Username"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base  text-gray-600"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-300 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base  text-gray-600"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-300 p-2 rounded-xl relative ">
            <FaFingerprint />
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-600"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>
        <button className = "w-full p-2 !bg-amber-500 rounded-xl mt-3 hover:bg-amber-600">Register</button>

        </div>
        </div>
)
}

export default Register;