import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="bg-gray-800 text-white p-4 flex">
      <NavLink to="/" className="text-white">
        <h1 className="text-2xl font-bold">My App</h1>
      </NavLink>
      <div className="ml-auto flex space-x-4">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white hover:text-gray-300')}>
          Home
        </NavLink>
        <NavLink to="/signup" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white hover:text-gray-300')}>
          Signup
        </NavLink>
        {isAuthenticated ? (
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white hover:text-gray-300')}>
            Profile
          </NavLink>
        ) : (
          <NavLink to="/signin" className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-white hover:text-gray-300')}>
            Signin
          </NavLink>
        )}
      </div>
    </div>
  )
}

export default Navbar