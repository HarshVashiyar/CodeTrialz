import { useAuth } from "../Context/AuthContext";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="w-full bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-lg border-b border-gray-200 shadow-[0_8px_32px_-12px_rgba(99,102,241,0.15)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 tracking-tight drop-shadow hover:scale-105 transition-transform duration-200">
            CodeTrialz
          </span>
        </NavLink>
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg ${
                isActive
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`
            }
          >
            Home
          </NavLink>
          {isAuthenticated ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg ${
                  isActive
                    ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`
              }
            >
              Profile
            </NavLink>
          ) : (
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg ${
                  isActive
                    ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                }`
              }
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
