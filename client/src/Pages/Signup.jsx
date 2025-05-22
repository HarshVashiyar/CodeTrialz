import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Fields marked with * are required.");
      return;
    }
    setError("");
    setIsLoading(true);
    if (isLoading) {
      toast.loading("Please wait while we sign you up...");
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_USER_SIGNUP_URL
        }`,
        {
          fullName,
          email,
          password,
        }
      );
      if (response.data?.success === true) {
        setIsLoading(false);
        toast.success("Signed up successfully!");
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-2">
          Join us and start your journey!
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs text-center">
            {error}
          </div>
        )}
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
              Date of Birth
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-xs text-gray-500 text-center mt-1">
          Please provide a valid email as it will be used to login, reset your
          password, and for future communication.
        </div>
        <p className="text-xs text-center mt-1">
          Already a user?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline font-semibold"
            onClick={() => navigate("/signin")}
          >
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
