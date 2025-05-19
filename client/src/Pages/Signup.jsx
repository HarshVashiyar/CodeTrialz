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
      setError("Please enter both email and password.");
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
    <div className="container">
      <Toaster richColors position="top-center" />
      <div className="wrapper bg-gray-100 w-full h-full min-h-full flex items-center justify-center">
        <form
          className="bg-white p-8 rounded shadow-md flex flex-col gap-4 min-w-[300px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold mb-4 text-center">Sign Up</h1>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          <input
            type="date"
            placeholder="Date of Birth"
            className="border p-2 rounded"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
