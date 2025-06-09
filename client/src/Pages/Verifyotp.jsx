import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Verifyotp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(150);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast.error("OTP expired! Redirecting to sign in...");
          setTimeout(() => navigate("/signin"), 700);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setIsLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_VERIFY_OTP_URL
        }`,
        { email, otp }
      );
      toast.dismiss(toastId);
      setIsLoading(false);
      if (response.data?.success === true) {
        toast.success("OTP verified successfully!");
        setTimeout(() => {
          navigate("/resetpassword", { state: { email } });
        }, 700);
      } else {
        toast.error(response.data?.message || "Invalid OTP.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      setIsLoading(false);
      if (error?.response?.data?.message) {
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
              Verify OTP
            </h1>
            <p className="text-center text-gray-500 mt-2">
              OTP sent to{" "}
              <span className="font-semibold text-purple-600">{email}</span>
            </p>
            <p className="text-center text-sm font-medium text-red-500 mt-2">
              Time remaining: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
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
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="6-digit OTP"
                className="w-full border-2 border-purple-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition hover:border-purple-300 hover:cursor-text bg-white/50 tracking-widest text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center"
              disabled={isLoading || timeLeft === 0}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="text-sm text-gray-500 text-center mt-1 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            Please enter the OTP sent to your email to continue.
          </div>

          <p className="text-sm text-center">
            Didn't receive the OTP?{" "}
            <span
              className="text-blue-600 font-semibold hover:text-purple-600 transition-colors duration-200 hover:cursor-pointer hover:underline"
              onClick={() => navigate("/forgotpassword")}
            >
              Resend here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verifyotp;
