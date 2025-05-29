import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const languages = [
    { label: 'C++', value: 'cpp', defaultTemplate: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
    { label: 'Python', value: 'python', defaultTemplate: '# Your Python code here\n' },
    { label: 'JavaScript', value: 'javascript', defaultTemplate: '// Your JavaScript code here\n' },
    { label: 'Java', value: 'java', defaultTemplate: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' }
];

const Submit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { problemId, problemName } = location.state || {};

    if (!problemId) {
        navigate('/');
        return null;
    }

    const handleSubmit = async () => {
        if (!code.trim()) {
            toast.error('Please write some code before submitting');
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        const toastId = toast.loading('Testing your solution...');
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUBMIT_CODE_URL}`,
                {
                    code,
                    language,
                    problemId,
                },
                { withCredentials: true }
            );
            if (response.data?.success === true) {
                toast.success('All test cases passed! 🎉');
            } else {
                toast.error(`${response.data?.verdict}: ${response.data?.message}` || 'Something went wrong!');
            }
        } catch (error) {
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
        } finally {
            setIsSubmitting(false);
            toast.dismiss(toastId);
            setTimeout(() => {
                navigate('/submissions');
            }, 700);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
            <Toaster richColors position="top-center" />
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
                <h1 className="text-2xl font-bold text-purple-700 mb-6">{problemName}</h1>
                <div className="mb-4 flex items-center gap-4">
                    <label className="font-semibold text-gray-700">Language:</label>
                    <select
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer"
                        value={language}
                        onChange={(e) => {
                            const newLang = e.target.value;
                            setLanguage(newLang);
                            // Set template if code is empty
                            if (!code.trim()) {
                                const template = languages.find(lang => lang.value === newLang)?.defaultTemplate || '';
                                setCode(template);
                            }
                        }}
                        disabled={isSubmitting}
                    >
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    className="w-full min-h-[400px] border rounded-lg p-4 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    placeholder="Write your code here"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            const start = e.target.selectionStart;
                            const end = e.target.selectionEnd;
                            const newCode = code.substring(0, start) + '    ' + code.substring(end);
                            setCode(newCode);
                            setTimeout(() => {
                                e.target.selectionStart = e.target.selectionEnd = start + 4;
                            }, 0);
                        }
                    }}
                    disabled={isSubmitting}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center hover:cursor-pointer"
                >
                    {isSubmitting ? (
                        'Submitting...'
                    ) : (
                        'Submit Solution'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Submit; 