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
import { Dispatch, SetStateAction, useState } from "react";
import InputContainer from "../ui/reusables/input-container";
import { useSession } from "@/hooks/useSession";
import { useClasses } from "@/hooks/useClasses";
import SearchableNativeSelect from "../ui/reusables/select";
import StudentsModal, { DeleteConfirmModal } from "./students-modal";
import RowActionsMenu from "../ui/reusables/table-menu";
import Empty from "../ui/reusables/empty";
import { useTerms } from "@/hooks/useTerms";
import Pagination from "../ui/reusables/pagination";
import AdminDashboardSkeleton from "@/app/loading";
import SectionSkeleton from "../ui/reusables/section-loader";
import { constructClassName } from "@/lib/helpers/helper";

const StudentsTable = ({
  type,
  setOpen,
  setIsEdit,
  setEditStudent,
  setOpenDelete,
}: {
  type: "result" | "students";
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setIsEdit?: Dispatch<SetStateAction<boolean>>;
  setOpenDelete?: Dispatch<SetStateAction<boolean>>;
  setEditStudent?: Dispatch<SetStateAction<StudentsType>>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const classLevel = sp.get("classId");

  const [selectedClass, setSelectedClass] = useState<string>(classLevel || "");

  const { studentsData, isLoadingStudent } = useStudents({});
  const { sessionData, isLoadingSession } = useSession();
  const { classesData, isLoadingClasses } = useClasses();

  // const { termsData, isLoadingTerm, refetchTerms } = useTerms();

  const isLoading = isLoadingStudent || isLoadingSession || isLoadingClasses;

  const fetchedStudents: StudentsType[] = studentsData?.data?.students ?? [];
  const fetchedClasses: ClassType[] = classesData?.data?.classes ?? [];
  const fetchedSessions: SessionType[] = sessionData?.data?.sessions ?? [];

  const updateQueryParams = (classId: string) => {
    const next = new URLSearchParams(sp.toString());

    if (!classId) next.delete("classId");
    next.set("classId", classId);

    router.push(`${pathname}?${next.toString()}`);
  };

  if (isLoading) return <AdminDashboardSkeleton />;

  if (isLoadingSession) return <SectionSkeleton />;

  const curSessionId = fetchedSessions.find((sess) => sess.isActive)?._id;
  return (
    <TableOverflow>
      <div className="flex items-center justify-between mb-4">
        <h1 className="lg:text-xl  font-black">
          {type === "students" ? "Students Table" : "Student's Result table"}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <InputContainer>
            <SearchableNativeSelect
              options={[
                {
                  value: "",
                  label: "All",
                },
                ...fetchedClasses.map((cls) => ({
                  value: cls._id!,
                  label: `${constructClassName(cls.name, cls.level)} ${cls.arm}`,
                  disabled: !cls.isActive,
                })),
              ]}
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                updateQueryParams(value);
              }}
              placeholder="Select student class"
              // className="input"
            />
          </InputContainer>
          {type === "students" && (
            <button className="btn btn-primary" onClick={() => setOpen?.(true)}>
              + New Student
            </button>
          )}
        </div>
      </div>
      {!fetchedStudents?.length ? (
        <Empty
          title="No students found"
          description="No students found on your database."
        />
      ) : (
        <Table>
          <TableHeader>
            <Tr>
              <Th>Reg No.</Th>
              <Th>Name</Th>
              <Th className="text-[0px] md:text-sm">Age</Th>
              <Th>Class</Th>
              <Th className="text-[0px] md:text-sm">Session</Th>
              <Th className="text-[0px] md:text-sm">Gender</Th>
              <Th>Actions</Th>
            </Tr>
          </TableHeader>
          <Tbody>
            {fetchedStudents.map((student, index) => (
              <Tr key={index}>
                <Td>{student.studentsId}</Td>
                <Td>{student.fullName}</Td>
                <Td className="text-[0px] md:text-sm">{student.age} </Td>
                <Td>
                  {`${constructClassName((student.curClassId as ClassType).name, (student.curClassId as ClassType).level)}
                 ${(student.curClassId as ClassType)?.arm}`}
                </Td>
                <Td className="text-[0px] md:text-sm">
                  {(student.curSessionId as SessionType).session}
                </Td>
                <Td className="text-[0px] md:text-sm">{student.gender}</Td>
                <Td>
                  {/*<div>
                  <button className="btn">

                  </button>
                </div>*/}

                  <RowActionsMenu
                    actions={[
                      {
                        label: "View Student",
                        onClick: () => {
                          if (type === "students") {
                            router.push(`/students/${student._id}`);
                          } else {
                            router.push(`/results/${student._id}`);
                          }
                        },
                      },
                      {
                        label: type === "students" ? "Edit" : "Compute result",
                        onClick: () => {
                          if (type === "students") {
                            setIsEdit?.(true);
                            setEditStudent?.(student);
                          } else {
                            router.push(`/results/${student._id}/compute`);
                            if (curSessionId) {
                              sessionStorage.clear();
                              sessionStorage.setItem(
                                "sessionId",
                                curSessionId ?? "",
                              );
                            }
                          }
                        },
                      },
                      ...(type === "students"
                        ? [
                            {
                              label: "Delete",
                              onClick: () => {
                                setOpenDelete?.(true);
                                setEditStudent?.(student);
                              },
                            },
                          ]
                        : []),
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Pagination
        paramName="page"
        limitParamName="limit"
        meta={studentsData?.pagination}
        className="mt-8"
      />
    </TableOverflow>
  );
};

export default StudentsTable;
