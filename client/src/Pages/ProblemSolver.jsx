import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const languages = [
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
];

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const ProblemSolver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstMount = useRef(true);
  const { isAuthenticated } = useAuth();
  const problemName = location.state?.problemName;

  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!problemName) {
      navigate("/");
      return;
    }

    const fetchProblem = async () => {
      const toastId = toast.loading("Loading problem...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_VIEW_PROBLEM_URL}`,
          { params: { name: problemName, allTestCases: false } }
        );
        if (response.data?.success) {
          setProblem(response.data.problem);
          if (isFirstMount.current) {
            // toast.success("Problem loaded successfully!");
            isFirstMount.current = false;
          }
        } else {
          toast.error("Failed to load problem.");
        }
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
        console.error(error);
      } finally {
        toast.dismiss(toastId);
      }
    };
    
    fetchProblem();
  }, [problemName, navigate]);

  const handleRun = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please Sign In To Run Code.");
      setTimeout(() => {
        navigate("/signin");
      }, 700);
      return;
    }
    if(isRunning) return;
    setIsRunning(true);
    setOutput("");
    const toastId = toast.loading("Running your code...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_RUN_CODE_URL}`,
        {
          language,
          code,
          input,
        },
        { withCredentials: true }
      );
      toast.dismiss(toastId);
      if (response.data?.success === true) {
        setIsRunning(false);
        toast.success("Code executed successfully!");
        setOutput(response.data.output);
      } else {
        toast.error("Unknown error occurred.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      setIsRunning(false);
      const errorType = error.response?.data?.type || "internal_error";
      let userMessage;
      switch (errorType) {
        case "compile_error":
          userMessage = "Compilation failed";
          break;
        case "runtime_error":
          userMessage = "Runtime error";
          break;
        case "time_limit_exceeded":
          userMessage = "Time Limit Exceeded";
          break;
        case "internal_error":
        default:
          userMessage = "Server error";
      }
      toast.error(userMessage);
      setOutput("");
      console.error("Run error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please Sign In To Submit Code.");
      setTimeout(() => {
        navigate("/signin");
      }, 700);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Testing your solution...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_SUBMIT_CODE_URL
        }`,
        {
          code,
          language,
          problemName: problem.name,
        },
        { withCredentials: true }
      );
      if (response.data?.success === true) {
        toast.success("All test cases passed! 🎉");
      } else {
        toast.error(
          `${response.data?.verdict}: ${response.data?.message}` ||
            "Something went wrong!"
        );
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
      toast.dismiss(toastId);
      setTimeout(() => {
        navigate("/submissions", { state: { previousPath: "/problemsolver", problemName: problemName } });
      }, 700);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      
      {/* Left Panel - Problem Description */}
      <div className="w-[45%] h-full overflow-y-auto p-6">
        <div className={`rounded-2xl shadow-2xl p-0 overflow-hidden mb-6 ${gradientBorder}`}>
          <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
                {problem.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  Number(problem.difficulty) <= 1200
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : Number(problem.difficulty) <= 1800
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:cursor-pointer ${
                  activeTab === "description"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-purple-50"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("testcases")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:cursor-pointer ${
                  activeTab === "testcases"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-purple-50"
                }`}
              >
                Test Cases
              </button>
            </div>

            {activeTab === "description" ? (
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                    Problem Statement
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-4 shadow-inner">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                      {problem.statement}
                    </pre>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                    Input Format
                  </h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-inner">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">
                      {problem.inputFormat}
                    </pre>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-pink-700 mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-pink-400 rounded-full"></span>
                    Output Format
                  </h3>
                  <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 shadow-inner">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">
                      {problem.outputFormat}
                    </pre>
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-4">
                {problem.testCases?.slice(0, 2).map((tc, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-50 to-purple-50 border border-purple-100 rounded-lg p-4 shadow-inner">
                    <div className="mb-2">
                      <span className="font-semibold text-blue-700">Input:</span>
                      <pre className="mt-1 p-2 bg-white rounded-md border border-blue-100 font-mono text-sm overflow-x-auto">
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-semibold text-green-700">Expected Output:</span>
                      <pre className="mt-1 p-2 bg-white rounded-md border border-green-100 font-mono text-sm overflow-x-auto">
                        {tc.output}
                      </pre>
                    </div>
                  </div>
                ))}
                {problem.testCases.length > 2 && (
                  <p className="text-gray-500 text-sm mt-3 italic text-center">
                    + {problem.testCases.length - 2} more test cases...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Code Editor and Console */}
      <div className="flex-1 h-full p-6">
        <div className={`h-full rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}>
          <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl flex flex-col h-full">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-3 py-1.5 border-2 border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white appearance-none hover:cursor-pointer font-medium transition-all duration-200 pr-8"
                      disabled={isRunning || isSubmitting}
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value} className="hover:cursor-pointer">
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#60a5fa",
                      }}
                    >
                      <span style={{ fontSize: "18px", color: "#60a5fa" }}>v</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer"
                  >
                    {isRunning ? "Running..." : "Run"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:from-green-600 hover:to-blue-600 hover:cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              <div className="flex-1 mb-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full h-full p-4 font-mono text-sm bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none shadow-inner transition-all duration-200 ${
                    isRunning || isSubmitting ? "cursor-not-allowed" : "hover:cursor-text"
                  }`}
                  // placeholder="Code execution and submission instance has been turned off to save aws credits."
                  disabled={isRunning || isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      const newCode = code.substring(0, start) + "    " + code.substring(end);
                      setCode(newCode);
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 4;
                      }, 0);
                    }
                  }}
                />
              </div>

              <div className="flex gap-4 h-48">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    Custom Input
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`w-full h-40 p-3 font-mono text-sm bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none shadow-inner transition-all duration-200 ${
                      isRunning || isSubmitting ? "cursor-not-allowed" : "hover:cursor-text"
                    }`}
                    placeholder="Enter your test input here..."
                    disabled={isRunning || isSubmitting}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-purple-700 mb-1">
                    Output
                  </label>
                  <pre className="w-full h-40 p-3 font-mono text-sm bg-purple-50 border-2 border-purple-200 rounded-lg overflow-auto shadow-inner">
                    {output}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver; 