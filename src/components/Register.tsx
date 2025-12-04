import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../apis/register";

interface User {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User>({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const togglePasswordView = () => setShowPassword((prev) => !prev);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("User registered successfully");
      navigate("/login");
    },
    onError: () => {
      alert("Error registering user");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(user);
  };

  return (
    <section className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-amber-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm md:max-w-md bg-white flex flex-col items-center gap-4 rounded-xl shadow-lg p-10"
      >
        <Link
          to="/login"
          className="self-start mb-2 !text-gray-600 hover:text-amber-500 transition-colors"
        >
          ← Back to Login
        </Link>

        <h1 className="text-xl text-emerald-800 font-bold">Create Your Account</h1>

        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
            <FaFingerprint className="text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
              className="bg-transparent w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
            <MdAlternateEmail className="text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="bg-transparent w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200 relative">
            <FaFingerprint className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="bg-transparent w-full outline-none text-gray-700"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-4 cursor-pointer text-gray-500"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 cursor-pointer text-gray-500"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full p-3 !bg-amber-500 text-white rounded-xl mt-4 hover:bg-amber-600 transition-colors font-medium disabled:opacity-50"
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
};

export default Register;
