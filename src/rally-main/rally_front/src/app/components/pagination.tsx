"use client";
import styles from "./pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
      <button
        className="px-2 py-1 text-sm border rounded min-w-[36px] text-center disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Précédent
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 py-1 text-sm text-gray-500 min-w-[36px] text-center"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`px-2 py-1 text-sm border rounded min-w-[36px] text-center ${page === currentPage ? styles.pagination_button_current : ""
              }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-2 py-1 text-sm border rounded min-w-[36px] text-center disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
