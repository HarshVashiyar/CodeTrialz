import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const languages = [
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
];

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
      //const errorMsg = error.response?.data?.message || "Something went wrong!";

      let userMessage;
      switch (errorType) {
        case "compile_error":
          userMessage = "Compilation failed" //+ errorMsg;
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
      //setError(userMessage);
      setOutput("");
      console.error("Run error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Toaster richColors position="top-center" />
      <div className="bg-white rounded-xl shadow-lg p-8 flex gap-8 w-full max-w-5xl">
        <div className="flex-1 flex flex-col">
          <div className="mb-4 flex items-center gap-4">
            <label className="font-semibold text-gray-700">Language:</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <div className="mb-2 text-red-600 font-medium">{error}</div>
          )}
          <textarea
            className="w-full flex-1 min-h-72 border rounded-lg p-4 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            style={{ height: "400px" }}
            placeholder="Write your code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const newCode = code.substring(0, start) + '    ' + code.substring(end);
                setCode(newCode);
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + 4;
                }, 0);
              }
            }}
          />
          <button
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition hover:cursor-pointer"
            onClick={handleRun}
          >
            Run Code
          </button>
        </div>
        {/* Right: Input/Output */}
        <div className="w-80 flex flex-col gap-6" style={{ height: "400px" }}>
          <div className="flex flex-col flex-[4_4_0%]">
            <label className="block mb-2 font-semibold text-gray-700">
              Input
            </label>
            <textarea
              className="w-full flex-1 border rounded-lg p-3 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Custom input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col flex-[6_6_0%]">
            <label className="block mb-2 font-semibold text-gray-700">
              Output
            </label>
            <textarea
              className="w-full flex-1 border rounded-lg p-3 font-mono text-sm bg-gray-100 focus:outline-none resize-none"
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
