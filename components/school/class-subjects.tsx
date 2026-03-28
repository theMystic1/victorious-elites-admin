"use client";

import { useClassSubjects, useSubjectClasses } from "@/hooks/useSubjectClasses";
import { Cols, Row } from "../ui/reusables/cols-rows";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Tr,
} from "../ui/reusables/table";
import { CustomButton } from "../ui/reusables/custom-btn";
import { ClassType, SubjectClassType, SubjectType } from "@/utils/types";
import Empty from "../ui/reusables/empty";
import { ActiveBadge } from "./single-session";
import SubjectClassesModal from "./subject-class-modal";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import SectionSkeleton from "../ui/reusables/section-loader";

const ClassSubjects = () => {
  const [openModal, setOpenModal] = useState(false);
  const { classId } = useParams();

  const { classSubjectsData, isLoadingClassSubjects, refetchClassSubjects } =
    useClassSubjects();

  const { subjectsData, isLoadingSubjects, refetchSubjects } = useSubjects();
  if (isLoadingClassSubjects || isLoadingSubjects) return <SectionSkeleton />;

  const subjectClasses: SubjectClassType[] =
    classSubjectsData?.data?.classSubjects;

  const fetchedSubjects: SubjectType[] = subjectsData?.data?.subjects ?? [];

  const handleOpen = () => setOpenModal(true);
  return (
    <Cols>
      <TableOverflow>
        <Row className="justify-between gap-4 mb-5">
          <h1 className="font-black text-xl">Subjects This Class Offers</h1>
          <div>
            <CustomButton onClick={handleOpen}>+ Add Subject</CustomButton>
          </div>
        </Row>

        {!subjectClasses?.length ? (
          <Cols className="items-center gap-2">
            <Empty
              title="No Classes"
              description="No classes offer this subject yet"
            />
            <div>
              <CustomButton onClick={handleOpen}>+ Add Subject</CustomButton>
            </div>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Td>Name</Td>
                <Td>Code</Td>
                <Td>Status</Td>
              </Tr>
            </TableHeader>
            <Tbody>
              {subjectClasses.map((cls) => (
                <Tr key={cls._id}>
                  <Td>{(cls.subjectId as SubjectType)?.name}</Td>
                  <Td>{(cls.subjectId as SubjectType)?.code}</Td>
                  <Td>
                    <ActiveBadge
                      status={
                        (cls?.subjectId as SubjectType)?.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableOverflow>

      <SubjectClassesModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        subjectId={classId as string}
        refetchStaff={refetchClassSubjects}
        subjects={fetchedSubjects}
      />
    </Cols>
  );
};

export default ClassSubjects;
