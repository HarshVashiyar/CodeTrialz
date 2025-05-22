import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const Verifyotp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_VERIFY_OTP_URL}`,
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
                    Verify OTP
                </h1>
                <p className="text-center text-gray-500 mb-2">
                    OTP sent to <span className="font-semibold">{email}</span>
                </p>
                {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs text-center">
                        {error}
                    </div>
                )}
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                            Enter OTP <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="6-digit OTP"
                            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm tracking-widest text-center"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify"}
                    </button>
                </form>
                <div className="text-xs text-gray-500 text-center mt-1">
                    Please enter the OTP sent to your email to continue.
                </div>
                <p className="text-xs text-center mt-1">
                    Didn't receive the OTP?{" "}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline font-semibold"
                        onClick={() => navigate("/forgotpassword")}
                    >
                        Resend
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Verifyotp;