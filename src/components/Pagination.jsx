import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full bg-gray-700 text-white disabled:opacity-50 hover:bg-cyan-500 transition"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-white">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full bg-gray-700 text-white disabled:opacity-50 hover:bg-cyan-500 transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
