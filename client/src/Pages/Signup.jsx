import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [dob, setDob] = useState("");
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
    const toastId = toast.loading("Please wait while we sign you up...");
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
        toast.dismiss(toastId);
        setIsLoading(false);
        toast.success("Signed up successfully!");
        setTimeout(() => {
          navigate("/signin");
        }, 700);
      }
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.message) {
        toast.dismiss(toastId);
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-md mx-auto rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Join us and start your journey!
            </p>
          </div>

          {error && (
            <div className="bg-red-100/80 text-red-700 px-4 py-2 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold text-sm">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>

            {/* <div>
              <label className="block text-gray-700 mb-1 font-semibold text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={isLoading}
              />
            </div> */}

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400 mt-2 hover:cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="flex flex-col gap-2 text-center">
            <p className="text-gray-600 text-sm">
              Please provide a valid email as it will be used to login, reset
              your password, and for future communication.
            </p>
            <p className="text-gray-600 text-sm">
              Already a user?{" "}
              <span
                className="text-blue-600 hover:text-blue-700 hover:cursor-pointer font-semibold hover:underline"
                onClick={() => navigate("/signin")}
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
