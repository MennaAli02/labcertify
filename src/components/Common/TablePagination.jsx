import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TablePagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50]
}) => {
  const { t, isRTL } = useLanguage();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(totalItems, validCurrentPage * pageSize);

  // Generate intelligent page numbers array
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (validCurrentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (validCurrentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-[#dee2e8]/25 px-4 sm:px-6 py-3 border-t border-[#c0cad8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#485261]">
      
      {/* Left: Rows Per Page Selector & Record Count */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
        
        {/* Rows per page selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="rows-per-page-select" className="text-[#9995A6] font-medium whitespace-nowrap text-[11px] sm:text-xs">
            {t.rowsPerPage || (isRTL ? 'الصفوف بالصفحة:' : 'Rows per page:')}
          </label>
          <select
            id="rows-per-page-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-[#c0cad8] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#485261] focus:outline-none focus:border-[#0B96C7] cursor-pointer shadow-2xs hover:border-[#6bbada] transition-colors"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[#c0cad8] hidden sm:inline">|</span>

        {/* Showing X - Y of Z records */}
        <div className="font-mono text-[11px] sm:text-xs text-[#485261] font-medium tabular-nums">
          {totalItems === 0 ? (
            <span className="text-[#9995A6] font-sans">
              {isRTL ? 'لا توجد سجلات مطابقة' : 'No records found'}
            </span>
          ) : (
            <span>
              {isRTL
                ? `عرض ${startIndex + 1} إلى ${endIndex} من أصل ${totalItems} سجل`
                : `Showing ${startIndex + 1}–${endIndex} of ${totalItems} records`}
            </span>
          )}
        </div>
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
        
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={validCurrentPage <= 1}
          className="p-1.5 rounded-lg border border-[#c0cad8] bg-white hover:bg-[#dee2e8]/60 text-[#485261] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer active:scale-95"
          title={t.firstPage || (isRTL ? 'الصفحة الأولى' : 'First page')}
          aria-label={t.firstPage || (isRTL ? 'الصفحة الأولى' : 'First page')}
        >
          <ChevronsLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(validCurrentPage - 1)}
          disabled={validCurrentPage <= 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#c0cad8] bg-white hover:bg-[#dee2e8]/60 text-[#485261] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer active:scale-95 text-xs font-semibold"
          title={t.prevPage || (isRTL ? 'الصفحة السابقة' : 'Previous page')}
          aria-label={t.prevPage || (isRTL ? 'الصفحة السابقة' : 'Previous page')}
        >
          <ChevronLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="hidden md:inline">{t.prevPage || (isRTL ? 'السابق' : 'Prev')}</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1 px-0.5">
          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-[#9995A6] font-mono text-xs select-none">
                  ...
                </span>
              );
            }

            const isPageActive = page === validCurrentPage;
            return (
              <button
                type="button"
                key={`page-${page}`}
                onClick={() => onPageChange?.(page)}
                className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isPageActive
                    ? 'bg-[#0B96C7] text-white shadow-xs'
                    : 'bg-white text-[#485261] border border-[#c0cad8] hover:bg-[#dee2e8]/60 hover:border-[#6bbada]'
                }`}
                aria-current={isPageActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#c0cad8] bg-white hover:bg-[#dee2e8]/60 text-[#485261] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer active:scale-95 text-xs font-semibold"
          title={t.nextPage || (isRTL ? 'الصفحة التالية' : 'Next page')}
          aria-label={t.nextPage || (isRTL ? 'الصفحة التالية' : 'Next page')}
        >
          <span className="hidden md:inline">{t.nextPage || (isRTL ? 'التالي' : 'Next')}</span>
          <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(totalPages)}
          disabled={validCurrentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#c0cad8] bg-white hover:bg-[#dee2e8]/60 text-[#485261] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer active:scale-95"
          title={t.lastPage || (isRTL ? 'الصفحة الأخيرة' : 'Last page')}
          aria-label={t.lastPage || (isRTL ? 'الصفحة الأخيرة' : 'Last page')}
        >
          <ChevronsRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
