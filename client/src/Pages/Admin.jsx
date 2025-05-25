import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

const difficultyOptions = Array.from(
  { length: (2500 - 800) / 100 + 1 },
  (_, i) => 800 + i * 100
);

const Admin = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading problems...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_GET_UNVERIFIED_PROBLEMS_URL
          }`,
          { withCredentials: true }
        );
        if (response.data?.success) {
          setProblems(response.data.problems);
          setFilteredProblems(response.data.problems);
          toast.success("Problems loaded!");
        } else {
          toast.error("Failed to load problems.");
        }
      } catch (err) {
        toast.error("Something went wrong!");
      } finally {
        setLoading(false);
        toast.dismiss();
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    let filtered = problems;
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.every((tag) => p.tags?.includes(tag))
      );
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(
        (p) => String(p.difficulty) === String(selectedDifficulty)
      );
    }
    setFilteredProblems(filtered);
  }, [search, selectedTags, selectedDifficulty, problems]);

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleViewProblem = (problemId) => {
    navigate("/viewproblem", { state: { problemId } });
  };

  const handleSelectProblem = (problemId) => {
    if (problemId === 'all') {
      if (selectedProblems.length === filteredProblems.length) {
        setSelectedProblems([]);
      } else {
        setSelectedProblems(filteredProblems.map(p => p._id));
      }
    } else {
      setSelectedProblems((prev) =>
        prev.includes(problemId)
          ? prev.filter((id) => id !== problemId)
          : [...prev, problemId]
      );
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedProblems.length === 0) {
      toast.error("No problems selected!");
      return;
    }
    const toastId = toast.loading("Removing selected problems...");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_REMOVE_PROBLEMS_URL}`,
        {
          data: { problemIds: selectedProblems },
          withCredentials: true
        }
      );
      if (response.data?.success === true) {
        setProblems(prev => prev.filter(p => !selectedProblems.includes(p._id)));
        setSelectedProblems([]);
        toast.success("Problems removed successfully!");
      } else {
        toast.error("Failed to remove problems.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleVerifySelected = async () => {
    if (selectedProblems.length === 0) {
      toast.error("No problems selected!");
      return;
    }
    const toastId = toast.loading("Verifying selected problems...");
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_VERIFY_PROBLEMS_URL}`,
        { problemIds: selectedProblems },
        { withCredentials: true }
      );
      if (response.data?.success) {
        setProblems(prev => prev.filter(p => !selectedProblems.includes(p._id)));
        setSelectedProblems([]);
        toast.success("Problems verified successfully!");
      } else {
        toast.error("Failed to verify problems.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex justify-center py-8">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg px-6 py-5 mb-6 flex flex-col md:flex-row md:items-end gap-4 border border-purple-100">
          <div className="flex-1">
            <label className="block text-purple-700 font-semibold mb-1 text-sm">
              Search
            </label>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-2 border-purple-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>
          <div className="flex-1">
            <span className="block text-purple-700 font-semibold mb-1 text-sm">
              Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <label
                  key={tag}
                  className={`flex items-center px-2 py-0.5 rounded-full border cursor-pointer transition text-xs
                    ${
                      selectedTags.includes(tag)
                        ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold"
                        : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-blue-50"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    className="mr-1 accent-blue-500"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="w-40">
            <span className="block text-purple-700 font-semibold mb-1 text-sm">
              Difficulty
            </span>
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none"
              >
                <option value="">All</option>
                {difficultyOptions.map((val) => (
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
        </div>
        <div className="bg-white rounded-xl shadow-lg p-0 w-full">
          {loading ? (
            <div className="text-center text-purple-600 font-semibold py-8">
              Loading problems...
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center text-gray-400 font-semibold py-8">
              No problems found.
            </div>
          ) : (
            <ul className="divide-y">
              <li className="px-6 py-3 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProblems.length === filteredProblems.length && filteredProblems.length > 0}
                      onChange={() => handleSelectProblem('all')}
                      className="accent-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRemoveSelected}
                      disabled={selectedProblems.length === 0}
                      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded transition font-semibold text-sm
                        ${selectedProblems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    >
                      Remove Selected
                    </button>
                    <button
                      onClick={handleVerifySelected}
                      disabled={selectedProblems.length === 0}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition font-semibold text-sm
                        ${selectedProblems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                      Verify Selected
                    </button>
                  </div>
                </div>
              </li>
              {filteredProblems.map((problem) => (
                <li
                  key={problem._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProblems.includes(problem._id)}
                      onChange={() => handleSelectProblem(problem._id)}
                      className="accent-blue-500"
                    />
                    <div>
                      <div className="text-lg font-bold text-purple-700">
                        {problem.name}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {problem.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Created by: {problem.createdBy?.fullName || "Unknown"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        Number(problem.difficulty) <= 1200
                          ? "bg-green-100 text-green-700"
                          : Number(problem.difficulty) <= 1800
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    {/* <button
                      onClick={() => handleRemoveProblem(problem._id)}
                      className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white px-4 py-1.5 rounded transition font-semibold text-sm"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleVerifyProblem(problem._id)}
                      className="bg-blue-600 hover:bg-blue-800 hover:cursor-pointer text-white px-4 py-1.5 rounded transition font-semibold text-sm"
                    >
                      Verify
                    </button> */}
                    <button
                      onClick={() => handleViewProblem(problem._id)}
                      className="bg-purple-600 hover:bg-purple-800 hover:cursor-pointer text-white px-4 py-1.5 rounded transition font-semibold text-sm"
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
