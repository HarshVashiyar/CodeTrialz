import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const ViewProblem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const problemId = location.state?.problemId;
  const previousPage = location.state?.previousPage;

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
      } catch (error) {
        setLoading(false);
        toast.dismiss(toastId);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    };

    fetchProblem();
    // eslint-disable-next-line
  }, []);

  // const handleSubmit = () => {
  //   navigate("/submit", {
  //     state: {
  //       problemId: problemId,
  //       problemName: problem.name,
  //     },
  //   });
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* <Toaster richColors position="top-center" /> */}
      <div
        className={`w-full max-w-3xl mx-auto mt-6 mb-6 rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
                {problem.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-gray-700">Rating:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    Number(problem.difficulty) <= 1200
                      ? "bg-green-100 text-green-700"
                      : Number(problem.difficulty) <= 1800
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(previousPage || "/")}
                className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Back
              </button>
              {/* <button
                onClick={handleSubmit}
                className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Submit Solution
              </button> */}
            </div>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-purple-700 mb-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
              Description
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-4 text-gray-800 shadow-inner">
              <pre className="whitespace-pre-wrap break-words font-sans text-base leading-relaxed">
                {problem.statement}
              </pre>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                Input
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-gray-800 shadow-inner">
                <pre className="whitespace-pre-wrap break-words font-sans text-base">
                  {problem.inputFormat}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pink-700 mb-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-pink-400 rounded-full"></span>
                Output
              </h3>
              <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-gray-800 shadow-inner">
                <pre className="whitespace-pre-wrap break-words font-sans text-base">
                  {problem.outputFormat}
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
              Sample Test Cases
            </h3>
            {problem.testCases && problem.testCases.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {problem.testCases.map((tc, idx) => (
                    <li
                      key={idx}
                      className="bg-gradient-to-br from-gray-50 to-purple-50 border border-purple-100 rounded-lg p-4 shadow-inner"
                    >
                      <div className="mb-2">
                        <span className="font-semibold text-blue-700">
                          Input:
                        </span>
                        <pre className="bg-white rounded-md p-2 mt-1 mb-1 overflow-x-auto text-gray-700 border border-blue-100 font-mono text-sm">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="font-semibold text-pink-700">
                          Expected Output:
                        </span>
                        <pre className="bg-white rounded-md p-2 mt-1 overflow-x-auto text-gray-700 border border-pink-100 font-mono text-sm">
                          {tc.output}
                        </pre>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-gray-400 text-base text-center mt-2">
                No test cases available.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ViewProblem;
