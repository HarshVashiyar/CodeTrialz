import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-8px_32px_-12px_rgba(99,102,241,0.15)]">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col items-center gap-2">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 tracking-tight drop-shadow-sm hover:scale-105 transition-transform duration-200">
          The OJ Project
        </h1>
        <p className="text-sm text-gray-600 text-center font-medium">
          &copy; {new Date().getFullYear()} The OJ Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
