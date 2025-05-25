import "./App.css";
import { Routes, Route } from "react-router-dom";
// import { Toaster, toast } from 'sonner'
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Sendotp from "./Pages/Sendotp";
import Verifyotp from "./Pages/Verifyotp";
import Resetpassword from "./Pages/Resetpassword";
import Profile from "./Pages/Profile";
import Compiler from "./Pages/Compiler";
import Addproblem from "./Pages/Addproblem";
import Addtestcase from "./Pages/Addtestcase";
import ViewProblem from "./Pages/Viewproblem";
import Admin from "./Pages/Admin";

function App() {
  return (
    <div className="bg-gray-500 min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="main-container flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/sendotp" element={<Sendotp />} />
          <Route path="/verifyotp" element={<Verifyotp />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/addproblem" element={<Addproblem />} />
          <Route path="/addtestcase" element={<Addtestcase />} />
          <Route path="/viewproblem" element={<ViewProblem />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        {/* <Toaster position="top-right" richColors /> */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
