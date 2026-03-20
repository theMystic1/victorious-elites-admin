"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const School_Layout = ({ children }: { children: React.ReactNode }) => {
  const { sessionId, classId } = useParams();
  const pathname = usePathname();

  const dontShow = Boolean(sessionId || classId);

  const router = useRouter();

  return (
    <div>
      <div className="max-w-1/2">
        {dontShow ? null : (
          <div className="flex items-center gap-0 h-12  border border-gray-100 rounded-lg ">
            <button
              className={`${!pathname.includes("class") ? "bg-black text-white " : ""} h-full w-full  p-1.5 rounded-l-lg shadow-lg cursor-pointer`}
              onClick={() => router.push(`/school`)}
            >
              School Session
            </button>
            <button
              className={`${pathname.includes("class") ? "bg-black text-white" : ""} h-full w-full  p-1.5 rounded-r-lg shadow-lg cursor-pointer`}
              onClick={() => router.push(`/school/class`)}
            >
              Class
            </button>
          </div>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default School_Layout;
