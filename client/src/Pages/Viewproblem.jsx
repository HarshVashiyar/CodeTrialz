import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation } from "react-router-dom";

const ViewProblem = () => {
  const location = useLocation();
  const problemId = location.state?.problemId;

  const [problem, setProblem] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading problem...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_VIEW_PROBLEM_URL
          }`,
          { params: { id: problemId } }
        );
        if (response.data?.success === true) {
          setLoading(false);
          toast.dismiss(toastId);
          setError("");
          setProblem(response.data.problem);
          toast.success("Problem loaded successfully!");
        } else {
          toast.dismiss(toastId);
          toast.error("Failed to add test cases.");
        }
      } catch (err) {
        setLoading(false);
        toast.dismiss(toastId);
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    };

    fetchProblem();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      {/* <Toaster richColors position="top-center" /> */}
      <div className="bg-white mt-3 mb-3 rounded-xl shadow-lg p-4 flex flex-col w-full max-w-3xl">
        <>
          <h1 className="text-2xl font-bold mb-2 text-purple-700 text-center">
            {problem.name}
          </h1>
          <div className="mb-1 flex items-center gap-2">
            <span className="font-semibold text-gray-700">Rating:</span>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded">
              {problem.difficulty}
            </span>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-purple-600 mb-0.5">
              Description
            </h3>
            <div className="bg-gray-50 border rounded p-2 text-gray-800">
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {problem.statement}
              </pre>
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-purple-600 mb-0.5">
              Input
            </h3>
            <div className="bg-gray-50 border rounded p-2 text-gray-800">
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {problem.inputFormat}
              </pre>
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-purple-600 mb-0.5">
              Output
            </h3>
            <div className="bg-gray-50 border rounded p-2 text-gray-800">
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {problem.outputFormat}
              </pre>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-1">
              Sample Test Cases
            </h3>
            {problem.testCases && problem.testCases.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {problem.testCases.slice(0, 2).map((tc, idx) => (
                    <li key={idx} className="bg-gray-100 border rounded p-2">
                      <div>
                        <span className="font-semibold text-blue-700">
                          Input:
                        </span>
                        <pre className="bg-gray-50 rounded p-1 mt-0.5 mb-1 overflow-x-auto text-gray-700">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="font-semibold text-blue-700">
                          Expected Output:
                        </span>
                        <pre className="bg-gray-50 rounded p-1 mt-0.5 overflow-x-auto text-gray-700">
                          {tc.output}
                        </pre>
                      </div>
                    </li>
                  ))}
                </ul>
                {problem.testCases.length > 2 && (
                  <p className="text-gray-500 text-sm mt-2 italic">
                    + {problem.testCases.length - 2} more test cases...
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-400">No test cases available.</p>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default ViewProblem;
