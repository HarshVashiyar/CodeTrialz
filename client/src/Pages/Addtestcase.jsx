import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const AddTestcase = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const problemId = location.state?.problemId || "";

    const [testCases, setTestCases] = useState([
        { input: "", output: "" },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTestCaseChange = (idx, field, value) => {
        setTestCases((prev) =>
            prev.map((tc, i) =>
                i === idx ? { ...tc, [field]: value } : tc
            )
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
        console.log("Problem ID:", problemId);
        setLoading(true);
        const toastId = toast.loading("Adding test cases...");
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADD_TESTCASE_URL}`,
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
                    navigate('/');
                }, 700);
            } else {
                toast.dismiss(toastId);
                toast.error("Failed to add test cases.");
            }
        } catch (err) {
            setLoading(false);
            toast.dismiss(toastId);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
            <Toaster richColors position="top-center" />
            <div className="bg-white shadow-2xl rounded-2xl px-6 pt-2 pb-2 w-full max-w-3xl relative">
                <h2 className="text-2xl font-extrabold mb-1 text-center text-blue-700 drop-shadow">
                    Add Test Cases
                </h2>
                <div className="text-center mb-4">
                    <span className="text-gray-600 text-xs bg-gray-100/80 px-3 py-1 rounded-lg shadow-sm border border-gray-200">
                        Test cases require admin review • Use N/A if no test cases
                    </span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {testCases.map((tc, idx) => (
                        <div
                            key={idx}
                            className="border border-blue-200 rounded-lg p-4 mb-2 bg-blue-50 relative"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-blue-700">
                                    Test Case #{idx + 1}
                                </span>
                                {testCases.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTestCase(idx)}
                                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                                        title="Remove this test case"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700 mb-1 font-semibold">
                                    Input
                                </label>
                                <textarea
                                    value={tc.input}
                                    onChange={(e) =>
                                        handleTestCaseChange(idx, "input", e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                                    className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg shadow transition mb-2"
                    >
                        + Add Another Test Case
                    </button>
                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm text-center font-medium border border-red-200">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow transition
                            ${loading ? "opacity-60 cursor-not-allowed" : ""}
                        `}
                    >
                        {loading ? "Adding..." : "Add Test Cases"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTestcase;