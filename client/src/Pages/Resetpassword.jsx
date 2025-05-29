import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Resetpassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_RESET_PASSWORD_URL
        }`,
        { email, newPassword, confirmPassword }
      );
      toast.dismiss(toastId);
      setIsLoading(false);
      if (response.data?.success === true) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/signin");
        }, 700);
      } else {
        toast.error(response.data?.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.dismiss(toastId);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-md mx-6 rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-center tracking-tight drop-shadow">
              Reset Password
            </h1>
            <p className="text-center text-gray-500 mt-2">
              Resetting password for{" "}
              <span className="font-semibold text-purple-600">{email}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-100/80 text-red-700 px-4 py-2 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border-2 border-purple-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition hover:border-purple-300 hover:cursor-text bg-white/50"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border-2 border-purple-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition hover:border-purple-300 hover:cursor-text bg-white/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="text-sm text-gray-500 text-center mt-1 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            Make sure to use a strong password you haven't used before.
          </div>

          <p className="text-sm text-center">
            Remembered your password?{" "}
            <span
              className="text-blue-600 font-semibold hover:text-purple-600 transition-colors duration-200 hover:cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
