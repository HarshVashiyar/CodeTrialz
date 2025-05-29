import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setIsLoading(true);
    const toastId = toast.loading("Please wait while we sign you in...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_USER_SIGNIN_URL
        }`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.data?.success === true) {
        toast.dismiss(toastId);
        setIsLoading(false);
        toast.success("You're signed in successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 700);
      }
    } catch (error) {
      setIsLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.dismiss(toastId);
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <Toaster richColors position="top-center" />
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 flex flex-col gap-4 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-1 tracking-tight drop-shadow">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-2">
          Sign in to your account to continue
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs text-center">
            {error}
          </div>
        )}
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-xs text-center text-gray-600">
            Not a user?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer font-semibold"
              onClick={() => navigate("/signup")}
            >
              Create account here
            </span>
          </p>
          <p className="text-xs text-center text-gray-600">
            Forgot your password?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer font-semibold"
              onClick={() => navigate("/sendotp")}
            >
              Reset it here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
