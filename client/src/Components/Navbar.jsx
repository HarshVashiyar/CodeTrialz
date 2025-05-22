import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_CHECK_AUTH_STATUS_URL
          }`,
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    };
    checkAuthStatus();
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            My App
          </span>
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive
                  ? "text-blue-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
          {/* <NavLink
            to="/signup"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive
                  ? "text-blue-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Signup
          </NavLink> */}
          {isAuthenticated ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-blue-600 underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Profile
            </NavLink>
          ) : (
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-blue-600 underline underline-offset-4"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Signin
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
