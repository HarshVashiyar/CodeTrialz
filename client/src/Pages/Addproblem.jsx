import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Addproblem = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tagsArr, setTagsArr] = useState([]);
  const [statement, setStatement] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tagOptions = [
    "arrays",
    "strings",
    "math",
    "dp",
    "greedy",
    "graphs",
    "trees",
    "binary search",
    "sorting",
    "recursion",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !difficulty || tagsArr.length === 0 || !statement) {
      setError("Please fill all the fields.");
      return;
    }
    setError("");
    setLoading(true);
    const toastId = toast.loading("Adding problem...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_ADD_PROBLEM_URL
        }`,
        {
          name: name.trim(),
          difficulty: parseInt(difficulty, 10),
          tags: tagsArr.map((tag) => tag.trim()),
          inputFormat: inputFormat.trim(),
          outputFormat: outputFormat.trim(),
          statement: statement.trim(),
        },
        { withCredentials: true }
      );
      if (response.data?.success === true) {
        toast.dismiss(toastId);
        setLoading(false);
        toast.success("Problem sent for admin verification successfully!");
        setTimeout(() => {
          navigate("/addtestcase", {
            state: { problemId: response.data?.problem._id },
          });
        }, 700);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss(toastId);
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
              Add Problem
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
              Problem requires admin review before publishing
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-semibold">
                Name
              </label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                placeholder="Enter problem name"
                autoComplete="off"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1 font-semibold">
                Difficulty
              </label>
              <div className="relative">
                <select
                  name="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none hover:cursor-pointer"
                >
                  <option value="">Select difficulty</option>
                  {Array.from(
                    { length: (2500 - 800) / 100 + 1 },
                    (_, i) => 800 + i * 100
                  ).map((val) => (
                    <option key={val} value={val}>
                      {val}
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
                  <span style={{ fontSize: "18px", color: "#60a5fa" }}>v</span>
                </span>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 mb-1 font-semibold">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <label
                    key={tag}
                    className={`flex items-center px-2 py-0.5 rounded-full border cursor-pointer transition text-xs
                      ${
                        tagsArr.includes(tag)
                          ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold"
                          : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-blue-50"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      className="mr-1 accent-blue-500 hover:cursor-pointer"
                      checked={tagsArr.includes(tag)}
                      onChange={() => {
                        if (tagsArr.includes(tag)) {
                          setTagsArr(tagsArr.filter((t) => t !== tag));
                        } else {
                          setTagsArr([...tagsArr, tag]);
                        }
                      }}
                    />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 mb-1 font-semibold">
                Statement
              </label>
              <textarea
                name="statement"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                placeholder="Describe the problem statement here..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">
                Input Format
              </label>
              <textarea
                name="inputFormat"
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                placeholder="Describe the input format here..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">
                Output Format
              </label>
              <textarea
                name="outputFormat"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white hover:cursor-text"
                placeholder="Describe the output format here..."
                rows={3}
              />
            </div>
            {error && (
              <div className="col-span-1 md:col-span-2 bg-red-100 text-red-700 px-3 py-2 rounded text-sm text-center font-medium border border-red-200">
                {error}
              </div>
            )}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:cursor-pointer"
                }`}
              >
                {loading ? "Adding..." : "Add Problem"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addproblem;
