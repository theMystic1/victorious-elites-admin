"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import { useStudents } from "@/hooks/useStudents";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useState } from "react";
import InputContainer from "../ui/reusables/input-container";
import { useSession } from "@/hooks/useSession";
import { useClasses } from "@/hooks/useClasses";
import SearchableNativeSelect from "../ui/reusables/select";
import StudentsModal, { DeleteConfirmModal } from "./students-modal";
import RowActionsMenu from "../ui/reusables/table-menu";

const Students = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editStudent, setEditStudent] = useState<StudentsType | undefined>(
    undefined,
  );

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const { studentsData, isLoadingStudent, refetchStudents } = useStudents();
  const { sessionData, isLoadingSession } = useSession();
  const { classesData, isLoadingClasses } = useClasses();

  const isLoading = isLoadingStudent || isLoadingSession || isLoadingClasses;
  if (isLoading) return <div>Loading...</div>;

  const fetchedStudents: StudentsType[] = studentsData?.data?.students ?? [];
  const fetchedClasses: ClassType[] = classesData?.data?.classes ?? [];
  const fetchedSessions: SessionType[] = sessionData?.data?.sessions ?? [];

  const updateQueryParams = (classId: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set("classId", classId);

    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="">
      <TableOverflow>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">Students Table</h1>
          <div className="flex items-center gap-2">
            <InputContainer>
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
            </InputContainer>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              + New Student
            </button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <Tr>
              <Th>Reg No.</Th>
              <Th>Name</Th>
              <Th>Age</Th>
              <Th>Class</Th>
              <Th>Session</Th>
              <Th>Gender</Th>
              <Th>Actions</Th>
            </Tr>
          </TableHeader>
          <Tbody>
            {fetchedStudents.map((student, index) => (
              <Tr key={index}>
                <Td>{student.studentsId}</Td>
                <Td>{student.fullName}</Td>
                <Td>{student.age} </Td>
                <Td>
                  {(student.curClassId as ClassType).name
                    ?.toLowerCase()
                    .includes("p")
                    ? `Primary ${(student.curClassId as ClassType).name.split("")[1]}`
                    : (student.curClassId as ClassType).name}{" "}
                  {(student.curClassId as ClassType)?.arm}
                </Td>
                <Td>{(student.curSessionId as SessionType).session}</Td>
                <Td>{student.gender}</Td>
                <Td>
                  {/*<div>
                    <button className="btn">

                    </button>
                  </div>*/}

                  <RowActionsMenu
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
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <StudentsModal
          fetchedClasses={fetchedClasses}
          fetchedSessions={fetchedSessions}
          open={open || isEdit}
          onClose={() => {
            setOpen(false);
            setIsEdit(false);
          }}
          refetchStudents={refetchStudents}
          isEdit={isEdit}
          editStudent={editStudent}
        />

        <DeleteConfirmModal
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setEditStudent(undefined);
          }}
          item="Student"
          refetch={refetchStudents}
          studentId={editStudent?._id as string}
        />
      </TableOverflow>
    </div>
  );
};

export default Students;
