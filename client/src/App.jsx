import "./App.css";
import { Routes, Route } from "react-router-dom";
// import { Toaster, toast } from 'sonner'
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";

function App() {
  return (
    <div className="bg-gray-500 min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="main-container flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
        {/* <Toaster position="top-right" richColors /> */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
