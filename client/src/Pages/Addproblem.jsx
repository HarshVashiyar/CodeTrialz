import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !difficulty || tagsArr.length === 0 || !statement) {
      setError("Please fill all the fields.");
      return;
    }
    // console.log(name);
    // console.log(difficulty);
    // console.log(tagsArr);
    // console.log(statement);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Toaster richColors position="top-center" />
      <div className="bg-white shadow-2xl rounded-2xl px-6 pt-2 pb-2 w-full max-w-3xl relative">
        <h2 className="text-2xl font-extrabold mb-1 text-center text-blue-700 drop-shadow">
          Add Problem
        </h2>
        <div className="text-center mb-4">
          <span className="text-gray-600 text-xs bg-gray-100/80 px-3 py-1 rounded-lg shadow-sm border border-gray-200">
            Problem requires admin review before publishing
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
          style={{ maxHeight: "90vh", overflow: "auto" }}
        >
          <div className="col-span-1">
            <label className="block text-gray-700 mb-1 font-semibold">
              Name
            </label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none"
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
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">
              Tags{" "}
            </label>
            <div className="flex flex-wrap gap-1">
              {[
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
              ].map((tag) => (
                <label
                  key={tag}
                  className={`flex items-center px-2 py-0.5 rounded-full border cursor-pointer transition
                    ${
                      tagsArr.includes(tag)
                        ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold"
                        : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-blue-50"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    className="mr-1 accent-blue-500"
                    checked={tagsArr.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTagsArr([...tagsArr, tag]);
                      } else {
                        setTagsArr(tagsArr.filter((t) => t !== tag));
                      }
                    }}
                  />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-semibold">
              Statement
            </label>
            <textarea
              name="statement"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="w-full px-3 py-1.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Describe the output format here..."
              rows={3}
            />
          </div>
          {error && (
            <div className="col-span-2 bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm text-center font-medium border border-red-200">
              {error}
            </div>
          )}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow transition
                ${loading ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {loading ? "Adding..." : "Add Problem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addproblem;
