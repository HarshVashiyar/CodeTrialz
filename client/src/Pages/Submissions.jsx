import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const SuggestionsModal = ({ isOpen, onClose, suggestions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl w-[90%] max-w-5xl max-h-[85vh] overflow-hidden border border-purple-100">
        <div className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
              AI Suggestions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 hover:cursor-pointer focus:outline-none "
          >
            X
          </button>
        </div>
        <div className="px-8 py-6 overflow-auto max-h-[65vh] bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <pre className="bg-white rounded-xl p-6 overflow-x-auto border border-purple-100 shadow-inner font-mono text-[15px] leading-relaxed text-gray-800">
            <code className="selection:bg-blue-100">{suggestions}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const CodeModal = ({ isOpen, onClose, code, language }) => {
  if (!isOpen) return null;

  const getLanguageIcon = (lang) => {
    switch (lang?.toLowerCase()) {
      case "cpp":
        return "🔷";
      case "java":
        return "☕";
      case "python":
        return "🐍";
      case "javascript":
        return "💛";
      default:
        return "📝";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl w-[90%] max-w-5xl max-h-[85vh] overflow-hidden border border-purple-100">
        <div className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getLanguageIcon(language)}</span>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
              Solution Code - {language || "Unknown Language"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 hover:cursor-pointer focus:outline-none "
          >
            X
          </button>
        </div>
        <div className="px-8 py-6 overflow-auto max-h-[65vh] bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <pre className="bg-white rounded-xl p-6 overflow-x-auto border border-purple-100 shadow-inner font-mono text-[15px] leading-relaxed text-gray-800">
            <code className="selection:bg-blue-100">{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const Submissions = () => {
  const navigate = useNavigate();
  const isFirstMount = useRef(true);
  const location = useLocation();
  const previousPath = location.state?.previousPath || "/";
  const problemName = location.state?.problemName || null;

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: "", language: "" });
  const [suggestions, setSuggestions] = useState("");
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);

  const handleViewCode = (code, language, e) => {
    e.stopPropagation();
    setSelectedCode({ code, language });
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      const toastId = toast.loading("Loading submissions...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_VIEW_SUBMISSIONS_URL
          }`,
          { withCredentials: true }
        );
        if (response.data?.success) {
          setSubmissions(response.data.submissions);
          if (isFirstMount.current) {
            toast.success("Here are your submissions!");
            isFirstMount.current = false;
          }
        }
      } catch (error) {
        if (isFirstMount.current) {
          toast.error(
            error.response?.data?.message || "Failed to load submissions"
          );
          isFirstMount.current = false;
        }
        console.error(error);
      } finally {
        setIsLoading(false);
        toast.dismiss(toastId);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusColor = (verdict) => {
    if (!verdict) return "text-gray-600";

    switch (verdict.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "wrong answer":
        return "bg-red-100 text-red-800";
      case "time limit exceeded":
        return "bg-orange-100 text-orange-800";
      case "compilation error":
        return "bg-yellow-100 text-yellow-800";
      case "runtime error":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "text-gray-600";

    const difficultyNum = parseInt(difficulty);
    if (isNaN(difficultyNum)) return "text-gray-600";

    if (difficultyNum <= 1000) {
      return "text-green-600 font-medium";
    } else if (difficultyNum <= 2000) {
      return "text-orange-600 font-medium";
    } else {
      return "text-red-600 font-medium";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLanguageIcon = (language) => {
    switch (language?.toLowerCase()) {
      case "cpp":
        return "🔷";
      case "java":
        return "☕";
      case "python":
        return "🐍";
      case "javascript":
        return "💛";
      default:
        return "📝";
    }
  };

  const handleGetSuggestions = async (code) => {
    const toastId = toast.loading("Prompting AI for suggestions...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_GET_SUGGESTIONS_URL
        }`,
        { code },
        { withCredentials: true }
      );
      if (response.data?.success === true) {
        setSuggestions(response.data.suggestions);
        setSuggestionsModalOpen(true);
      }
    } catch (error) {
      if(error.response.data.success === false) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-4">
      <Toaster richColors position="top-center" />
      <CodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        code={selectedCode.code}
        language={selectedCode.language}
      />
      <SuggestionsModal
        isOpen={suggestionsModalOpen}
        onClose={() => setSuggestionsModalOpen(false)}
        suggestions={suggestions}
      />
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 mb-8 ${gradientBorder}`}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600">
              My Submissions
            </h1>
            <div className="flex gap-4 ml-auto">
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:cursor-pointer"
              >
                Solve Problems
              </button>
              <button
                onClick={() => navigate(previousPath, { state: { problemName } })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div
          className={`bg-white bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden ${gradientBorder}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    When
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Verdict
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Failed On Test Case
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Score
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Real time AI Suggestion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200/50">
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500">
                          Loading submissions...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        No submissions yet. Start solving problems!
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:cursor-pointer">
                          {submission.problemName}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${getDifficultyColor(
                          submission.difficulty
                        )}`}
                      >
                        {submission.difficulty || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {getLanguageIcon(submission.language)}
                          </span>
                          <span className="text-sm text-gray-900">
                            {submission.language}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            submission.verdict
                          )}`}
                        >
                          {submission.verdict}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            submission.failedTestCase > 0
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {submission.failedTestCase > 0
                            ? submission.failedTestCase
                            : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.executionTime > 0
                          ? `${submission.executionTime}ms`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) =>
                            handleViewCode(
                              submission.code,
                              submission.language,
                              e
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 hover:underline hover:cursor-pointer text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            submission.score > 0
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {submission.score > 0 ? submission.score : "-"}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleGetSuggestions(submission.code)}
                          className="text-blue-600 hover:text-blue-800 hover:underline hover:cursor-pointer text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={submission.verdict !== "Accepted"}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;
