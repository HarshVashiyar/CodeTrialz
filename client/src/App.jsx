import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
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
import Addproblem from "./Pages/Addproblem";
import Addtestcase from "./Pages/Addtestcase";
import ViewProblem from "./Pages/Viewproblem";
import Admin from "./Pages/Admin";
import Submissions from "./Pages/Submissions";
import ViewSolutions from "./Pages/ViewSolutions";
import ProblemSolver from "./Pages/ProblemSolver";

function App() {
  return (
    <AuthProvider>
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
            <Route path="/addproblem" element={<Addproblem />} />
            <Route path="/addtestcase" element={<Addtestcase />} />
            <Route path="/viewproblem" element={<ViewProblem />} />
            <Route path="/problemsolver" element={<ProblemSolver />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/viewsolutions" element={<ViewSolutions />} />
          </Routes>
          {/* <Toaster position="top-right" richColors /> */}
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
