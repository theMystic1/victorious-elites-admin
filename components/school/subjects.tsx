"use client";

import { useClasses } from "@/hooks/useClasses";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { CustomButton } from "../ui/reusables/custom-btn";
import Empty from "../ui/reusables/empty";
import InputContainer from "../ui/reusables/input-container";
import SearchableNativeSelect from "../ui/reusables/select";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import { ClassType, SubjectType } from "@/utils/types";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSubjects } from "@/hooks/useSubjects";
import { ActiveBadge } from "./single-session";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import SubjectsModal from "./subject-modal";
import Pagination from "../ui/reusables/pagination";
import AdminDashboardSkeleton from "@/app/loading";
import { constructClassName } from "@/lib/helpers/helper";
import { useClassSubjects } from "@/hooks/useSubjectClasses";

const Subjects = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTerm, setSelectedTerm] = useState<SubjectType | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const { subjectsData, isLoadingSubjects, refetchSubjects } = useSubjects();
  const { classSubjectsData, isLoadingClassSubjects } = useClassSubjects();

  const sub = classSubjectsData?.data?.classSubjects?.map((subj: any) => ({
    ...subj?.subjectId,
  }));
  const fetchedSubjects: SubjectType[] =
    sub?.length > 0 ? sub : (subjectsData?.data?.subjects ?? []);
  const { classesData, isLoadingClasses } = useClasses();
  const fetchedClasses: ClassType[] = classesData?.data?.classes ?? [];

  const updateQueryParams = (classId: string) => {
    const next = new URLSearchParams(sp.toString());

    if (!classId) next.delete("classId");
    else next.set("classId", classId);

    router.push(`${pathname}?${next.toString()}`);
  };

  if (isLoadingClasses || isLoadingSubjects || isLoadingClassSubjects)
    return <AdminDashboardSkeleton />;
  return (
    <Cols className="gap-5 mt-6">
      <TableOverflow className="min-h-100 ">
        <Row className="justify-between gap-4 mb-6">
          <h1>All Subjects</h1>

          <div className="flex items-center gap-2">
            <InputContainer>
              <SearchableNativeSelect
                options={[
                  { value: "", label: "All" },
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
          </div>

          <div>
            <CustomButton onClick={() => setOpenModal(true)}>
              + Add Subject
            </CustomButton>
          </div>
        </Row>
        {!fetchedSubjects?.length ? (
          <Cols className="justify-center items-center gap-4">
            <Empty
              title="No subjects found"
              description="No subjects exists in your school"
            />

            <Row className="justify-center items-center ">
              <CustomButton onClick={() => setOpenModal(true)}>
                + Add Subject
              </CustomButton>
            </Row>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th>Subject</Th>
                <Th>Code</Th>
                <Th>Subject status</Th>
                <Th>Actions</Th>
              </Tr>
            </TableHeader>
            <Tbody>
              {fetchedSubjects?.map((subject) => (
                <Tr key={subject._id}>
                  <Td>{subject.name}</Td>
                  <Td>{subject.code}</Td>
                  <Td>
                    <ActiveBadge
                      status={subject.isActive ? "Active" : "Inactive"}
                    />
                  </Td>
                  <Td>
                    <RowActionsMenuPortal
                      actions={[
                        {
                          label: "View",
                          onClick: () =>
                            router.push(`/school/subject/${subject._id}`),
                        },
                        {
                          label: "Edit",
                          onClick: () => {
                            setIsEdit(true);
                            setSelectedTerm(subject as SubjectType);
                          },
                        },
                        // {
                        //   label: session?.isActive
                        //     ? "End Session"
                        //     : "Session Ended",
                        //   onClick: () => {
                        //     setOpenDelete(true);
                        //     // setEditStaff(staff);
                        //   },
                        //   disabled: !session?.isActive,
                        // },
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
          meta={subjectsData?.pagination}
          className="mt-8"
        />
      </TableOverflow>

      <SubjectsModal
        open={openModal || isEdit}
        onClose={() => {
          setOpenModal(false);
          setIsEdit(false);
          setSelectedTerm(null);
        }}
        refetchStudents={refetchSubjects}
        isEdit={isEdit}
        editStudent={selectedTerm!}
      />
    </Cols>
  );
};

export default Subjects;
