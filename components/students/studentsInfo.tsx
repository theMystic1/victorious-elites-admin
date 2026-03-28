"use client";

import { ClassType, SessionType, StudentsType } from "@/utils/types";
import { Box, BoxItemRow } from "./single-student";
import { Dispatch, SetStateAction } from "react";
import { constructClassName } from "@/lib/helpers/helper";

const StudentsInfo = ({
  singleStudent,
  type,
  setOpen,
  setOpenDelete,
}: {
  singleStudent: StudentsType;
  type: "student" | "result";
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setOpenDelete?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Box>
      <BoxItemRow title="Full Name" answer={singleStudent?.fullName ?? ""} />
      <BoxItemRow
        title="Current Class"
        answer={
          constructClassName(
            (singleStudent?.curClassId as ClassType)?.name,
            (singleStudent?.curClassId as ClassType)?.level,
          ) ?? ""
        }
      />
      <BoxItemRow
        title="Current Session"
        answer={(singleStudent?.curSessionId as SessionType)?.session ?? ""}
      />

      <BoxItemRow title="Gender" answer={singleStudent?.gender ?? ""} />
      <BoxItemRow title="Age" answer={singleStudent?.age ?? ""} />
      <BoxItemRow
        title="Results"
        answer={singleStudent?.results?.length ?? ""}
      />
      {type === "student" && (
        <BoxItemRow
          title="Actions"
          answer={
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="text-blue-600 cursor-pointer py-1 px-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300  border border-blue-600"
                onClick={() => setOpen?.(true)}
              >
                Edit
              </button>
              <button
                className="text-red-600 cursor-pointer py-1 px-3 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300  border border-red-600"
                onClick={() => setOpenDelete?.(true)}
              >
                Delete
              </button>
              <button className="text-yellow-600 cursor-pointer py-1 px-3 rounded-xl hover:bg-yellow-600 hover:text-white transition-all duration-300  border border-yellow-600">
                View results
              </button>
            </div>
          }
        />
      )}
    </Box>
  );
};

export default StudentsInfo;
