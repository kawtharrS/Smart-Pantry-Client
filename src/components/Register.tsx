import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface User{
  name:string;
  email:string;
  password:string;
}
const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordView = () => setShowPassword(!showPassword);
  const [user, setUser] = useState({name:"", email:"", password:"",});

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://127.0.0.1:8000/api/register", user);
      return response.data;
    },
    onSuccess: () =>{
      alert("User registered successfully");
    },
    onError:() =>{
      alert("Error registering user");
    }
  });

  const handleRegister = () =>{
    registerMutation.mutate();
  };


  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-amber-100">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md bg-white flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg p-10">
        <Link to="/login" className="self-start mb-4 !text-gray-600 hover:text-amber-500 transition-colors flex items-center">
          ← Back to Home
        </Link>
        <h1 className="text-lg md:text-xl  text-emerald-800 font-bold">Welcome</h1>
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center gap-2 bg-gray-300 p-2 rounded-xl">
            <FaFingerprint />
            <input
              type="text"
              placeholder="Username"
              value={user.name}
              onChange = {(e) => setUser({...user, name: e.target.value})}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base  text-gray-600"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-300 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              value = {user.email}
              onChange = {(e) =>  setUser({...user, email:e.target.value})}
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base  text-gray-600"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-300 p-2 rounded-xl relative ">
            <FaFingerprint />
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value = {user.password}
              onChange = {(e) => setUser({...user, password: e.target.value})}
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
        <button onClick= {handleRegister} className = "w-full p-2 !bg-amber-500 rounded-xl mt-3 hover:bg-amber-600">Register</button>
        </div>
        </div>
)
}

export default Register;