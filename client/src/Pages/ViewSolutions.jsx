import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

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
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 hover:cursor-pointer focus:outline-none hover:rotate-90 transform"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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

const ViewSolutions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const problemId = location.state?.problemId;
  const [submissions, setSubmissions] = useState([]);
  const [problemName, setProblemName] = useState("");
  const [problemDifficulty, setProblemDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState({ code: "", language: "" });

  const handleViewCode = (code, language, e) => {
    e.stopPropagation();
    setSelectedCode({ code, language });
    setModalOpen(true);
  };

  useEffect(() => {
    if (!problemId) {
      toast.error("Problem ID is required");
      navigate("/");
      return;
    }

    const fetchSubmissions = async () => {
      setIsLoading(true);
      const toastId = toast.loading("Loading solutions...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_GET_SOLUTIONS_URL
          }`,
          { params: { problemId } }
        );

        if (response.data?.success) {
          const { solutions, problemName, difficulty } =
            response.data.solutions;
          setProblemName(problemName || "Unknown Problem");
          setProblemDifficulty(difficulty);
          setSubmissions(Array.isArray(solutions) ? solutions : []);
          toast.success("Solutions loaded successfully!");
        } else {
          toast.error(response.data?.message || "Failed to load solutions");
        }
      } catch (error) {
        console.error("Error fetching solutions:", error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
        toast.dismiss(toastId);
      }
    };

    fetchSubmissions();
  }, [problemId, navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8 px-4">
      <Toaster richColors position="top-center" />
      <CodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        code={selectedCode.code}
        language={selectedCode.language}
      />
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 mb-8 ${gradientBorder}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600">
                {problemName} - Solutions
              </h1>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getDifficultyColor(
                    problemDifficulty
                  )} bg-opacity-10`}
                >
                  Difficulty: {problemDifficulty || "Unknown"}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Solve Problems
            </button>
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
                    Submission Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Verdict
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200/50">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500">
                          Loading solutions...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        No solutions found for this problem yet.
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          {submission.user?.fullName || "Anonymous"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {getLanguageIcon(submission.language)}
                          </span>
                          <span className="text-sm text-gray-900">
                            {submission.language || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            submission.verdict
                          )}`}
                        >
                          {submission.verdict || "Unknown"}
                          {submission.verdict !== "Accepted" &&
                            submission.failedTestCase > 0 && (
                              <span className="ml-1">
                                (Test Case {submission.failedTestCase})
                              </span>
                            )}
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
                          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            submission.score > 0
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {submission.score > 0 ? submission.score : "-"}
                        </span>
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

export default ViewSolutions;
