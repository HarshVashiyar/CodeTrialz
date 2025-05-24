import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
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
          toast.success("User data loaded successfully!");
          return;
        }
      } catch (error) {
        setIsLoading(false);
        toast.dismiss(toastID);
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
    <div
      className="container flex flex-col items-center justify-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* <Toaster richColors position="top-center" /> */}
      <div className="w-full flex flex-col items-center mb-10">
        <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-1 w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center">
            <div className="relative">
              {user?.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-400 to-pink-400 flex items-center justify-center text-5xl font-extrabold text-white border-4 border-white shadow-xl">
                  {user?.fullName
                    ? user.fullName
                        .split("_")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </div>
              )}
              <span className="absolute bottom-2 right-2 bg-green-400 border-2 border-white rounded-full w-6 h-6"></span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-800">
              {user?.fullName || "Loading..."}
            </h3>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold text-purple-600">
                  {user?.problemsCreated?.length ?? 0}
                </span>
                <span className="text-xs text-gray-400">Created</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold text-pink-600">
                  {user?.submissions?.length ?? 0}
                </span>
                <span className="text-xs text-gray-400">Submissions</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold text-blue-600">
                  {user?.numberOfProblemsSolved ?? 0}
                </span>
                <span className="text-xs text-gray-400">Solved</span>
              </div>
            </div>
            <div className="w-full mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Date of Birth:</span>
                <span>{user?.dob || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Account Created:</span>
                <span>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Last Modified:</span>
                <span>
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
            {/* <button
              className="mt-6 px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 hover:cursor-pointer transition-all duration-200 font-bold"
              onClick={() => navigate("/editprofile")}
            >
              Edit Profile
            </button> */}
            <button
              className="mt-6 px-8 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg hover:from-red-600 hover:to-pink-600 hover:cursor-pointer transition-all duration-200 font-bold"
              onClick={handledeleteAccount}
            >
              Delete Account
            </button>
            <button
              className="mt-4 px-8 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-full shadow-lg hover:from-gray-600 hover:to-gray-800 hover:cursor-pointer transition-all duration-200 font-bold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
