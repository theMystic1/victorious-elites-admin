"use client";

import { useStudents } from "@/hooks/useStudents";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { useSession } from "@/hooks/useSession";
import { useClasses } from "@/hooks/useClasses";
import { ClassType, SessionType, StudentsType } from "@/utils/types";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import InputContainer from "../ui/reusables/input-container";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Empty from "../ui/reusables/empty";
import StudentsModal from "../students/students-modal";
import { useState } from "react";
import { CustomButton } from "../ui/reusables/custom-btn";
import SearchableNativeSelect from "../ui/reusables/select";
import Pagination from "../ui/reusables/pagination";
import { constructClassName } from "@/lib/helpers/helper";

const ClassStudents = ({ curClass }: { curClass: ClassType }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentsType | null>(
    null,
  );
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sssId = sp.get("sessionId");

  const { sessionData, isLoadingSession } = useSession();
  const curSession = sessionData?.data?.sessions?.find(
    (ses: SessionType) => ses?.isActive === true,
  );
  const [sessionId, setSessionId] = useState<string | null>(
    sessionData?.data?.sessions?.find(
      (ses: SessionType) => ses?.isActive === true,
    ) || sssId,
  );

  const { studentsData, isLoadingStudent, refetchStudents } = useStudents({
    sesId: sssId || sessionId!,
    clId: curClass._id,
  });
  // const { classesData, isLoadingClasses } = useClasses();

  const isLoading = isLoadingStudent || isLoadingSession;
  if (isLoading) return <div>Loading...</div>;

  const fetchedStudents: StudentsType[] = studentsData?.data?.students ?? [];
  const fetchedSessions: SessionType[] = sessionData?.data?.sessions ?? [];

  const sessions = fetchedSessions.map((session) => ({
    value: session._id,
    label: `${session.session} ${session?.isActive ? "(current)" : ""}`,
  }));

  const updateQueryParams = (sessionId: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set("sessionId", sessionId);

    router.push(`${pathname}?${next.toString()}`);
  };

  console.log(studentsData);
  return (
    <Cols className="gap-4 mt-8">
      <TableOverflow>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">Students Table</h1>
          {/*<Row className="gap-4">
            <p className="text-sm text-gray-900 font-black">
              Filter by session:
            </p>
            <InputContainer label="" className="max-w-48">
              <SearchableNativeSelect
                options={sessions as { value: string; label: string }[]}
                value={sessionId || sssId!}
                onChange={(value) => {
                  setSessionId(value);
                  updateQueryParams(value);
                }}
                placeholder="Select Session to show"
              />
            </InputContainer>
          </Row>*/}

          <div className="flex items-center gap-2">
            {/*<InputContainer>
            <SearchableNativeSelect
              options={fetchedClasses.map((cls) => ({
                value: cls._id!,
                label: cls.name?.includes("P")
                  ? `Primary ${cls.name?.split("")[1]} ${cls.arm}`
                  : `${cls.name} ${cls.arm}`,
                disabled: !cls.isActive,
              }))}
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                updateQueryParams(value);
              }}
              placeholder="Select student class"
              // className="input"
            />
          </InputContainer>*/}
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              + New Student
            </button>
          </div>
        </div>
        {!fetchedStudents?.length ? (
          <Cols className="items-center gap-4">
            <Empty
              title=" No students found"
              description="No students found for this class."
            />

            <CustomButton onClick={() => setOpen(true)} className="max-w-44">
              + New Student
            </CustomButton>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th>Reg No.</Th>
                <Th>Name</Th>
                <Th className="text-sm hidden lg:flex">Age</Th>
                <Th>Class</Th>
                <Th className="text-sm hidden lg:flex">Session</Th>
                <Th>Gender</Th>
                {/*<Th>Actions</Th>*/}
              </Tr>
            </TableHeader>
            <Tbody>
              {fetchedStudents.map((student, index) => (
                <Tr key={index}>
                  <Td>{student.studentsId}</Td>
                  <Td>{student.fullName}</Td>
                  <Td className="text-sm hidden lg:flex">{student.age} </Td>
                  <Td>
                    {constructClassName(
                      (student.curClassId as ClassType).name,
                      (student.curClassId as ClassType).level,
                    )}
                  </Td>
                  <Td className="text-sm hidden lg:flex">
                    {(student.curSessionId as SessionType).session}
                  </Td>
                  <Td>{student.gender}</Td>
                  {/*<Td>


                  <RowActionsMenuPortal
                  actions={[
                    {
                      label: "View",
                      onClick: () => router.push(`/students/${student._id}`),
                    },
                    {
                      label: "Edit",
                      onClick: () => {
                        setIsEdit(true);
                        setEditStudent(student);
                      },
                    },
                    {
                      label: "Delete",
                      onClick: () => {
                        setOpenDelete(true);
                        setEditStudent(student);
                      },
                    },
                  ]}
                />
                </Td>*/}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <Pagination
          meta={studentsData?.pagination}
          paramName="page"
          limitParamName="limit"
        />
        <StudentsModal
          // fetchedClasses={fetchedClasses}
          // fetchedSessions={fetchedSessions}
          open={open || isEditing}
          onClose={() => {
            setOpen(false);
            setIsEditing(false);
            setEditingStudent(null);
          }}
          refetchStudents={refetchStudents}
          isEdit={isEditing}
          editStudent={editingStudent as StudentsType}
          curClass={curClass}
          curSession={fetchedSessions?.find(
            (s) => s._id === sessionId || s._id === curSession?._id,
          )}
        />

        {/*

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setEditStudent(undefined);
        }}
        item="Student"
        refetch={refetchStudents}
        studentId={editStudent?._id as string}
      />*/}
      </TableOverflow>
    </Cols>
  );
};

export default ClassStudents;
