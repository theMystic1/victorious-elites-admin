"use client";
import { FaRegUser, FaUserAlt } from "react-icons/fa";

import { useSingleStudent } from "@/hooks/useStudents";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Row } from "../ui/reusables/cols-rows";
import { CustomButton } from "../ui/reusables/custom-btn";
import { ClassType, SessionType, StudentsType } from "@/utils/types";
import StudentsModal, { DeleteConfirmModal } from "./students-modal";
import { useSession } from "@/hooks/useSession";
import { useClasses } from "@/hooks/useClasses";

const SingleStudent = ({ studentsId }: { studentsId: string }) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editStudent, setEditStudent] = useState<StudentsType | undefined>(
    undefined,
  );

  const { studentData, isLoadingStudent, refetchStudent } = useSingleStudent();

  const { sessionData, isLoadingSession } = useSession();
  const { classesData, isLoadingClasses } = useClasses();

  const isLoading = isLoadingStudent || isLoadingSession || isLoadingClasses;
  const fetchedClasses: ClassType[] = classesData?.data?.classes ?? [];
  const fetchedSessions: SessionType[] = sessionData?.data?.sessions ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (!studentData) return <div>Student not found</div>;

  const singleStudent = studentData?.data?.student;
  // console.log(singleStudent);

  return (
    <div className="relative w-full">
      <nav className="h-28 bg-gray-100 fixed z-999 top-0 left-0 right-0 ">
        <div className="flex  h-full w-full items-center gap-4 justify-between px-8 md:px-16 ">
          <div className="flex items-center gap-2 ">
            <div className="h-16 w-16 md:h-20 md:w-20  rounded-full bg-gray-500 flex items-center justify-center">
              <FaUserAlt className="w-8 h-8 text-gray-100" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold">
                {singleStudent?.fullName}
              </h2>
              <h2 className="text-gray-500 font-bold">
                {singleStudent?.gender}
              </h2>
            </div>
          </div>
          <div></div>
        </div>
      </nav>

      <div className="pt-32 flex flex-col items-start gap-4 px-0 md:px-12 w-full">
        <Row className="w-full justify-between!">
          <div>
            <BackBtn />
          </div>
          <div>
            <CustomButton>Compute result</CustomButton>
          </div>
        </Row>

        <Box>
          <BoxItemRow
            title="Full Name"
            answer={singleStudent?.fullName ?? ""}
          />
          <BoxItemRow
            title="Current Class"
            answer={singleStudent?.curClassId?.name ?? ""}
          />
          <BoxItemRow
            title="Current Session"
            answer={singleStudent?.curSessionId?.session ?? ""}
          />
          <BoxItemRow title="Gender" answer={singleStudent?.gender ?? ""} />
          <BoxItemRow title="Age" answer={singleStudent?.age ?? ""} />
          <BoxItemRow
            title="Results"
            answer={singleStudent?.results?.length ?? ""}
          />
          <BoxItemRow
            title="Actions"
            answer={
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  className="text-blue-600 cursor-pointer py-1 px-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300  border border-blue-600"
                  onClick={() => setOpen(true)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 cursor-pointer py-1 px-3 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300  border border-red-600"
                  onClick={() => setOpenDelete(true)}
                >
                  Delete
                </button>
                <button className="text-yellow-600 cursor-pointer py-1 px-3 rounded-xl hover:bg-yellow-600 hover:text-white transition-all duration-300  border border-yellow-600">
                  View results
                </button>
              </div>
            }
          />
        </Box>
      </div>

      <StudentsModal
        fetchedClasses={fetchedClasses}
        fetchedSessions={fetchedSessions}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        refetchStudents={refetchStudent}
        isEdit={open}
        editStudent={singleStudent}
      />

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setEditStudent(undefined);
        }}
        item="Student"
        refetch={refetchStudent}
        studentId={singleStudent?._id as string}
      />
    </div>
  );
};

export default SingleStudent;

export const Box = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`border border-gray-200 w-full min-h-100 rounded-lg  p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export const BoxItemRow = ({
  title,
  answer,
}: {
  title: string;
  answer: ReactNode;
}) => {
  return (
    <div className="grid grid-cols-2 gap-10 border-b border-gray-200 py-4 text-sm">
      <p className="text-gray-600 font-bold">{title}</p>
      <p className="text-gray-700 font-black">{answer}</p>
    </div>
  );
};

export const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      className="btn text-gray-500 hover:text-gray-900 hover:underline transition-all duration-300"
      onClick={() => router.back()}
    >
      <IoIosArrowRoundBack size={16} />
      <span>Back</span>
    </button>
  );
};
