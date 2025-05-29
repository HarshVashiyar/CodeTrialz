import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const languages = [
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
];

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Compiler = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async (e) => {
    e.preventDefault();

    if (!code || code.trim() === "") {
      setError("Please enter some code to run.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");
    setOutput("");
    const toastId = toast.loading("Running your code...");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_RUN_CODE_URL}`,
        {
          language,
          code,
          input,
        }
      );

      toast.dismiss(toastId);
      setLoading(false);

      if (response.data?.success === true) {
        toast.success("Code executed successfully!");
        setOutput(response.data.output);
      } else {
        toast.error("Unknown error occurred.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      setLoading(false);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-4xl mx-auto mb-6 rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
                Online Compiler
              </h2>
              <div className="flex items-center gap-3 ml-0 sm:ml-auto">
                <label className="font-semibold text-gray-700 text-sm">
                  Language:
                </label>
                <div className="relative">
                  <select
                    className="px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none hover:cursor-pointer text-sm font-medium"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={loading}
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
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
                    <span style={{ fontSize: "18px", color: "#60a5fa" }}>
                      v
                    </span>
                  </span>
                </div>
              </div>
            </div>
            {error && (
              <div className="mb-2 text-red-600 font-medium">{error}</div>
            )}
            <textarea
              className="w-full flex-1 min-h-72 border-2 border-purple-200 rounded-lg p-4 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none shadow-inner"
              style={{ height: "600px" }}
              placeholder="Write your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.target.selectionStart;
                  const end = e.target.selectionEnd;
                  const newCode =
                    code.substring(0, start) + "    " + code.substring(end);
                  setCode(newCode);
                  setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = start + 4;
                  }, 0);
                }
              }}
            />
            <button
              className={`mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2.5 px-7 rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:cursor-pointer"
              }`}
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? "Running..." : "Run Code"}
            </button>
          </div>
          <div
            className="w-full md:w-80 flex flex-col gap-6"
            style={{ height: "600px" }}
          >
            <div className="flex flex-col flex-[1_1_0%]">
              <label className="block mb-2 font-semibold text-blue-700">
                Input
              </label>
              <textarea
                className="w-full flex-1 border-2 border-blue-200 rounded-lg p-3 font-mono text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none shadow-inner"
                placeholder="Custom input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col flex-[0.7_0.7_0%]">
              <label className="block mb-2 font-semibold text-purple-700">
                Output
              </label>
              <textarea
                className="w-full flex-1 border-2 border-purple-200 rounded-lg p-3 font-mono text-sm bg-purple-50 focus:outline-none resize-none shadow-inner"
                value={output}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
