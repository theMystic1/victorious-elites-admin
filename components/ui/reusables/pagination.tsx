"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationMeta = {
  curPage: number;
  lastPage: number;
  total: number;
  limit: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

function buildPages(cur: number, last: number) {
  // Industry standard: 1 ... (cur-1 cur cur+1) ... last
  const pages: (number | "...")[] = [];
  const push = (v: number | "...") => pages.push(v);

  if (last <= 7) {
    for (let i = 1; i <= last; i++) push(i);
    return pages;
  }

  push(1);

  const left = Math.max(2, cur - 1);
  const right = Math.min(last - 1, cur + 1);

  if (left > 2) push("...");

  for (let i = left; i <= right; i++) push(i);

  if (right < last - 1) push("...");

  push(last);

  return pages;
}

const Pagination = ({
  meta,
  paramName = "page",
  limitParamName = "limit",
  className = "",
}: {
  meta: PaginationMeta;
  paramName?: string;
  limitParamName?: string;
  className?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  if (!meta) return;

  const curPage = Math.max(1, Number(sp?.get("page") || meta.curPage || 1));
  const lastPage = Math.max(1, Number(meta.lastPage || 1));
  const limit = Number(sp?.get("limit") || meta.limit || 50);
  const total = Number(meta.total || 0);

  const hasPrev = meta.hasPrev ?? curPage > 1;
  const hasNext = meta.hasNext ?? curPage < lastPage;

  const pages = React.useMemo(
    () => buildPages(curPage, lastPage),
    [curPage, lastPage],
  );

  const setPage = (page: number) => {
    const next = new URLSearchParams(sp.toString());
    next.set(paramName, String(page));
    // keep limit stable
    if (!next.get(limitParamName)) next.set(limitParamName, String(limit));
    router.push(`${pathname}?${next.toString()}`);
  };

  const setLimit = (newLimit: number) => {
    const next = new URLSearchParams(sp.toString());
    next.set(limitParamName, String(newLimit));
    next.set(paramName, "1"); // reset to first page
    router.push(`${pathname}?${next.toString()}`);
  };

  const start = total === 0 ? 0 : (curPage - 1) * limit + 1;
  const end = Math.min(curPage * limit, total);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      {/* left: range summary */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{start}</span>–
        <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{total}</span>
      </div>

      {/* middle/right: controls */}
      <div className="flex items-center gap-3">
        {/* page size */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[2, 5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* pager */}
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            className="px-1 py-1.5 text-sm border rounded disabled:opacity-50"
            disabled={!hasPrev}
            onClick={() => setPage(curPage - 1)}
          >
            Prev
          </button>

          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-gray-500">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`min-w-9 px-1 py-1.5 text-sm border rounded ${
                  p === curPage
                    ? "bg-black text-white border-black"
                    : "bg-white"
                }`}
                onClick={() => setPage(p)}
                aria-current={p === curPage ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}

          <button
            className="px-1 py-1.5 text-sm border rounded disabled:opacity-50"
            disabled={!hasNext}
            onClick={() => setPage(curPage + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
