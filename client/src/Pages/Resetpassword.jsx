import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

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
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_RESET_PASSWORD_URL}`,
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
            <Toaster richColors position="top-center" />
            <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 flex flex-col gap-4 w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-1 tracking-tight drop-shadow">
                    Reset Password
                </h1>
                <p className="text-center text-gray-500 mb-2">
                    Resetting password for <span className="font-semibold">{email}</span>
                </p>
                {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs text-center">
                        {error}
                    </div>
                )}
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
                <div className="text-xs text-gray-500 text-center mt-1">
                    Make sure to use a strong password you haven't used before.
                </div>
                <p className="text-xs text-center mt-1">
                    Remembered your password?{" "}
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

export default Resetpassword;