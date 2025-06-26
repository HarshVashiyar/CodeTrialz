import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

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
  "implementation",
  "brute force",
  // "constructive algorithms",
  // "data structures",
  "dfs",
  "bfs",
  "number theory",
  // "combinatorics",
  "geometry",
  // "bit manipulation",
  "two pointers",
  // "disjoint set union",
  // "shortest paths",
  // "probabilities",
  // "divide and conquer",
  "hashing",
  // "interactive",
  // "fft",
  // "chinese remainder theorem",
  // "linked list",
  // "trie",
  // "sliding window",
  // "backtracking",
  "heap",
  // "stack",
  // "memoization",
  // "topological sort",
  // "monotonic stack",
  // "segment tree",
  // "suffix array",
  // "minimum spanning tree",
  // "strongly connected components",
  // "game theory",
  // "simulation",
  "bitmask",
];

const difficultyOptions = Array.from(
  { length: (2500 - 800) / 100 + 1 },
  (_, i) => 800 + i * 100
);

const gradientBorder =
  "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-400 before:to-purple-400 before:blur-[2px] before:opacity-60 before:-z-10";

const Home = () => {
  const navigate = useNavigate();
  const isFirstMount = useRef(true);
  const { isAuthenticated } = useAuth();

  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading problems...");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_LIST_PROBLEMS_URL
          }`
        );
        if (response.data?.success) {
          setProblems(response.data.problems);
          setFilteredProblems(response.data.problems);
          if (isFirstMount.current) {
            toast.success("Welcome to the home page!");
            isFirstMount.current = false;
          }
        } else if (isFirstMount.current) {
          toast.error("Failed to load problems.");
          isFirstMount.current = false;
        }
      } catch (error) {
        if (isFirstMount.current) {
          toast.error("Something went wrong!");
          isFirstMount.current = false;
        }
      } finally {
        setLoading(false);
        toast.dismiss(toastId);
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

  const handleViewProblem = (problemName) => {
    navigate(`/problemsolver`, { state: { problemName } });
  };

  const handleViewSolutions = (problemName) => {
    navigate("/viewsolutions", { state: { problemName } });
  };

  const handleAddProblemClick = () => {
    if (isAuthenticated) {
      navigate("/addproblem");
    } else {
      toast.error("Please Sign In To Add A Problem.");
      setTimeout(() => {
        navigate("/signin");
      }, 700);
    }
  };

  const handleViewSolutionsClick = () => {
    if (isAuthenticated) {
      navigate("/viewsolutions");
    } else {
      toast.error("Please Sign In To View Solutions.");
      setTimeout(() => {
        navigate("/signin");
      }, 700);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-8">
      <Toaster richColors position="top-center" />
      <div
        className={`w-full max-w-5xl mx-auto mb-6 rounded-2xl shadow-2xl p-0 overflow-visible ${gradientBorder}`}
        style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.15)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-sm">
              Problem List
            </h1>
            <button
              onClick={handleAddProblemClick}
              className="hover:cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 text-white px-7 py-2.5 rounded-xl font-bold shadow-lg transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-green-300 hover:from-green-600 hover:to-blue-600 hover:bg-blue-600"
            >
              Add Problem
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1 text-sm">
                Search
              </label>
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2 border-purple-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 transition font-medium text-gray-800 bg-white"
              />
            </div>
            <div className="flex-1">
              <span className="block text-purple-700 font-semibold mb-1 text-sm">
                Tags
              </span>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-scroll">
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
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none hover:cursor-pointer text-sm font-medium"
                >
                  <option value="">All</option>
                  {difficultyOptions.map((val) => (
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
          </div>
        </div>
      </div>
      <div
        className={`w-full max-w-5xl mx-auto rounded-2xl shadow-xl p-0 overflow-hidden ${gradientBorder}`}
        style={{ boxShadow: "0 4px 16px 0 rgba(99,102,241,0.10)" }}
      >
        <div className="relative z-10 bg-white bg-opacity-95 rounded-2xl p-0">
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
              {filteredProblems.map((problem) => (
                <li
                  key={problem.name}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-6 py-4 hover:bg-purple-50/40 transition group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 group-hover:drop-shadow">
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
                      Created by: {problem.createdBy || "Unknown"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border
                        ${
                          Number(problem.difficulty) <= 1200
                            ? "bg-green-100 text-green-700 border-green-200"
                            : Number(problem.difficulty) <= 1800
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                    >
                      {problem.difficulty}
                    </span>
                    <button
                      onClick={() => handleViewProblem(problem.name)}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-1.5 rounded-xl transition font-semibold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 hover:cursor-pointer"
                    >
                      View Problem
                    </button>
                    <button
                      onClick={handleViewSolutionsClick}
                      className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-4 py-1.5 rounded-xl transition font-semibold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 hover:from-blue-700 hover:to-purple-600 hover:cursor-pointer"
                    >
                      View Solutions
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

export default Home;
