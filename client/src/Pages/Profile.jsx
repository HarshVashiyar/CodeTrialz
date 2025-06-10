import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isFirstMount = useRef(true);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const toastID = toast.loading("Loading user data...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_USER_PROFILE_URL
          }`,
          { withCredentials: true }
        );
        if (response.data?.success === true) {
          setUser(response.data.user);
          setIsLoading(false);
          toast.dismiss(toastID);
          if (isFirstMount.current) {
            toast.success("Welcome to your profile!");
            isFirstMount.current = false;
          }
          return;
        }
      } catch (error) {
        setIsLoading(false);
        toast.dismiss(toastID);
        if (error?.response?.data?.message) {
          if (isFirstMount.current) { 
            toast.error(error.response.data.message);
            isFirstMount.current = false;
          }
        } else {
          if (isFirstMount.current) {
            toast.error("Something went wrong!");
            isFirstMount.current = false;
          }
        }
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handledeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
    const toastID = toast.loading("Deleting account...");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_USER_DELETE_URL
        }`,
        { withCredentials: true }
      );
      toast.dismiss(toastID);
      logout();
      toast.success("Account deleted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      toast.dismiss(toastID);
      toast.error(error.response?.data?.message || "Failed to delete account.");
    }
  };

  const handleLogout = async () => {
    const toastID = toast.loading("Logging out...");
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_USER_LOGOUT_URL
        }`,
        {},
        { withCredentials: true }
      );
      toast.dismiss(toastID);
      logout();
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      toast.dismiss(toastID);
      toast.error(error.response?.data?.message || "Failed to logout.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-xl mx-auto my-4 rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {user?.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-extrabold text-white border-4 border-white shadow-xl">
                  {user?.fullName
                    ? user.fullName
                        .split("_")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </div>
              )}
              <span className="absolute bottom-2 right-2 bg-green-400 border-2 border-white rounded-full w-5 h-5"></span>
            </div>

            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
              {user?.fullName || "Loading..."}
            </h3>
            <p className="text-gray-500 mb-4 text-sm">{user?.email}</p>

            <div className="grid grid-cols-3 gap-4 w-full mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-xl shadow-sm">
                <div className="text-xl font-bold text-blue-600">
                  {user?.numberOfProblemsCreated ?? 0}
                </div>
                <div className="text-xs text-gray-500">Problems Created</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl shadow-sm transition-colors">
                <div className="text-xl font-bold text-purple-600">
                  {user?.numberOfSubmissions ?? 0}
                </div>
                <div className="text-xs text-gray-500">Submissions</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-xl shadow-sm">
                <div className="text-xl font-bold text-pink-600">
                  {user?.numberOfProblemsSolved ?? 0}
                </div>
                <div className="text-xs text-gray-500">Problems Solved</div>
              </div>
            </div>

            <div className="w-full space-y-2 mb-6">
              {/* <div className="flex justify-between py-1.5 px-4 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-600 font-medium">Date of Birth</span>
                <span className="text-gray-800">{user?.dob || "N/A"}</span>
              </div> */}
              <div className="flex justify-between py-1.5 px-4 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-600 font-medium">
                  Account Created
                </span>
                <span className="text-gray-800">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 px-4 bg-gray-50 rounded-lg text-sm">
                <span className="text-gray-600 font-medium">Last Modified</span>
                <span className="text-gray-800">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate("/submissions", { state: { previousPath: "/profile" } })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400 hover:cursor-pointer"
              >
                View My Submissions
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-200 tracking-wide focus:outline-none focus:ring-2 focus:ring-gray-400 hover:cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={handledeleteAccount}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 tracking-wide focus:outline-none focus:ring-2 focus:ring-red-400 hover:cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
