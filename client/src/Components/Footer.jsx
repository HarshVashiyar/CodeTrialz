import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-2xl mt-8">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col items-center gap-1">
        <h1 className="text-lg font-extrabold text-blue-700 tracking-tight drop-shadow">
          The OJ Project
        </h1>
        <p className="text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} The OJ Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;