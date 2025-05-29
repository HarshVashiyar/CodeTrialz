import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const Submit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { problemId, problemName } = location.state || {};

  if (!problemId) {
    navigate("/");
    return null;
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
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
          problemId,
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.dismiss(toastId);
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
      toast.dismiss(toastId);
      setTimeout(() => {
        navigate("/submissions");
      }, 700);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-3xl mx-auto mt-6 mb-6 rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
                {problemName}
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Back
            </button>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-purple-700 mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
              Submit Your Solution
            </h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex items-center gap-3">
                <label className="font-semibold text-gray-700 text-sm">
                  Language:
                </label>
                <div className="relative">
                  <select
                    className="px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none hover:cursor-pointer text-sm font-medium"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                    }}
                    disabled={isSubmitting}
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
            <div className="relative">
              <textarea
                className="w-full min-h-[400px] border-2 border-purple-200 rounded-lg p-4 font-mono text-base bg-gradient-to-br from-purple-50 to-blue-50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none shadow-inner transition"
                placeholder="Write your code here"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    const newCode =
                      code.substring(0, start) + "    " + code.substring(end);
                    setCode(newCode);
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd =
                        start + 4;
                    }, 0);
                  }
                }}
                disabled={isSubmitting}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  lineHeight: "1.6",
                }}
              />
              <div className="absolute right-4 top-4 text-xs text-gray-400 select-none pointer-events-none">
                {code.length} chars
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg tracking-wide hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Solution"
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Submit;
