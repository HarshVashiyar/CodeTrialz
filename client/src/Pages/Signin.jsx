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
    if (isLoading) {
      toast.loading("Please wait while we sign you in...");
    }
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
        setIsLoading(false);
        toast.success("You're signed in successfully!");
        setTimeout(() => {
          navigate("/");
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
    <div className="container">
      <Toaster richColors position="top-center" />
      <div className="wrapper bg-gray-100 w-full h-full min-h-full flex items-center justify-center">
        <form
          className="bg-white p-8 rounded shadow-md flex flex-col gap-4 min-w-[300px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold mb-4 text-center">Sign In</h1>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
