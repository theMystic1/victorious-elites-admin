"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const schoolPaths = [
  {
    value: "/school",
    label: "School Session",
  },
  {
    value: "/school/class",
    label: "Class",
  },
  {
    value: "/school/subject",
    label: "Subjects",
  },
];

const School_Layout = ({ children }: { children: React.ReactNode }) => {
  const { sessionId, classId, subjectId } = useParams();
  const pathname = usePathname();

  const dontShow = Boolean(sessionId || classId || subjectId);

  const router = useRouter();

  return (
    <div>
      <div className="lg:max-w-1/2 w-full">
        {dontShow ? null : (
          <div className="flex items-center gap-0 h-12  border border-gray-100 rounded-lg ">
            {schoolPaths?.map((path, i) => (
              <button
                key={path.value}
                className={` text-sm ${pathname === path.value ? "bg-black text-white" : ""} h-full w-full  p-1.5 ${i === 0 ? "rounded-l-lg" : i === schoolPaths.length - 1 ? "rounded-r-lg" : "border-l border-r border-gray-200"} shadow-lg cursor-pointer`}
                onClick={() => router.push(`${path.value}`)}
              >
                {path.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default School_Layout;
