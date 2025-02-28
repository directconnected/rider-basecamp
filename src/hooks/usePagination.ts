
import { useState, useEffect } from "react";
import { CampgroundResult } from "@/hooks/camping/types";

interface PaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

export const usePagination = <T>(
  items: T[],
  { initialPage = 1, itemsPerPage = 10 }: PaginationOptions = {}
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Make sure currentPage is within valid range
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get current items for the page
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  };
};
