import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const CodeModal = ({ isOpen, onClose, code, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Solution Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:cursor-pointer focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-auto max-h-[60vh]">
          <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-800">{code}</code>
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
    e.stopPropagation(); // Prevent row click event
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
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_SOLUTIONS_URL}`,
          { params: { problemId } }
        );

        if (response.data?.success) {
          const { solutions, problemName, difficulty } = response.data.solutions;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* <Toaster richColors position="top-center" /> */}
      <CodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        code={selectedCode.code}
        language={selectedCode.language}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {problemName} - Solutions
            </h1>
            <div className="mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problemDifficulty)}`}>
                Difficulty: {problemDifficulty || "Unknown"}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
          >
            Solve Problems
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500">Loading solutions...</span>
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
                      className="hover:bg-gray-50 transition-colors"
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
                          <span className="mr-2">{getLanguageIcon(submission.language)}</span>
                          <span className="text-sm text-gray-900">{submission.language || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.verdict)}`}>
                          {submission.verdict || "Unknown"}
                          {submission.verdict !== "Accepted" && submission.failedTestCase > 0 && (
                            <span className="ml-1">
                              (Test Case {submission.failedTestCase})
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.executionTime > 0 ? `${submission.executionTime}ms` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => handleViewCode(submission.code, submission.language, e)}
                          className="text-blue-600 hover:text-blue-800 underline cursor-pointer text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${submission.score > 0 ? "text-green-600" : "text-gray-500"}`}>
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