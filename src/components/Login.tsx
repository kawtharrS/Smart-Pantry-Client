import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../apis/login";

interface UserCredentials {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<UserCredentials>({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const payload = data.payload;
      login({ id: payload.id, name: payload.name, email: payload.email }, payload.token);
      alert("Welcome Back!");
      navigate("/choose");
    },
    onError: () => alert("Failed to login. Please check your email and password."),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email || !user.password) return;
    loginMutation.mutate(user);
  };

  return (
    <section className="min-h-screen w-screen bg-gradient-to-br from-green-100 to-amber-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm md:max-w-md lg:max-w-md bg-white flex flex-col items-center gap-3 rounded-xl shadow-lg p-8"
      >
        <Link
          to="/"
          className="self-start mb-4 !text-gray-600 hover:text-amber-500 transition-colors flex items-center"
        >
          ← Back to Home
        </Link>

        <h1 className="text-lg md:text-xl text-emerald-800 font-bold">Welcome Back</h1>
        <p className="text-xs md:text-sm text-gray-500 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-500">
            Sign up
          </Link>
        </p>

        <div className="w-full flex flex-col gap-3 mt-3">
          <div className="w-full flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200">
            <MdAlternateEmail className="text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-100 p-3 rounded-xl border border-gray-200 relative">
            <FaFingerprint className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-700 placeholder-gray-400"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaRegEye
                className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full p-3 !bg-amber-500 text-white rounded-xl mt-6 hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
};

export default Login;
