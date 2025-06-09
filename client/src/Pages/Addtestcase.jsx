import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const AddTestcase = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const problemId = location.state?.problemId || "";

  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTestCaseChange = (idx, field, value) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === idx ? { ...tc, [field]: value } : tc))
    );
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestCase = (idx) => {
    if (testCases.length === 1) return;
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    for (const tc of testCases) {
      if (!tc.input.trim() || !tc.output.trim()) {
        setError("All test cases must have both input and output.");
        return;
      }
    }
    if (!problemId) {
      setError("Problem ID is missing in the URL.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Adding test cases...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_ADD_TESTCASE_URL
        }`,
        {
          problemId: problemId,
          testCases: testCases.map((tc) => ({
            input: tc.input.trim(),
            output: tc.output.trim(),
          })),
        },
        { withCredentials: true }
      );
      if (response.data?.success) {
        toast.dismiss(toastId);
        toast.success("Test cases sent for admin verification successfully!");
        setTimeout(() => {
          navigate("/");
        }, 700);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-3xl mx-auto mt-6 mb-6 rounded-2xl shadow-2xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
              Add Test Cases
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-2.5 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Back
            </button>
          </div>
          <div className="text-center mb-2">
            <span className="text-gray-600 text-xs bg-gray-100/80 px-3 py-1 rounded-lg shadow-sm border border-gray-200">
              Test cases require admin review • Use N/A if no test cases
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6"
            style={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <div className="flex flex-col gap-4">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="border border-blue-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner relative"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-700 text-lg">
                      Test Case #{idx + 1}
                    </span>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(idx)}
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer font-bold text-2xl px-2 py-0.5 rounded transition"
                        title="Remove this test case"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Input
                    </label>
                    <textarea
                      value={tc.input}
                      onChange={(e) =>
                        handleTestCaseChange(idx, "input", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-mono text-sm bg-white hover:cursor-text"
                      placeholder="Enter input"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-semibold">
                      Output
                    </label>
                    <textarea
                      value={tc.output}
                      onChange={(e) =>
                        handleTestCaseChange(idx, "output", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition font-mono text-sm bg-white hover:cursor-text"
                      placeholder="Enter expected output"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addTestCase}
                className="w-full bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 hover:cursor-pointer text-blue-700 font-semibold py-2 px-4 rounded-xl shadow transition mb-2 border border-blue-200"
              >
                + Add Another Test Case
              </button>
              {error && (
                <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm text-center font-medium border border-red-200 shadow">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition text-lg tracking-wide
                  ${
                    loading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:cursor-pointer"
                  }
                `}
              >
                {loading ? "Adding..." : "Add Test Cases"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTestcase;
