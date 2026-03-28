"use client";

import * as React from "react";

type SkeletonProps = {
  className?: string; // optional extra styling
  rounded?: string; // e.g. "rounded-md", "rounded-xl"
};

const SectionSkeleton = ({
  className = "",
  rounded = "rounded-lg",
}: SkeletonProps) => {
  return (
    <div
      className={[
        "w-full min-h-100 h-full mt-8",
        rounded,
        "bg-gray-200/70",
        "overflow-hidden relative",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      {/* shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SectionSkeleton;
