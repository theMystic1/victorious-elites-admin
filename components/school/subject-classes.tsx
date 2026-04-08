"use client";

import { useSubjectClasses } from "@/hooks/useSubjectClasses";
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
import { ClassType, SubjectClassType } from "@/utils/types";
import Empty from "../ui/reusables/empty";
import { ActiveBadge } from "./single-session";
import SubjectClassesModal from "./subject-class-modal";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import SectionSkeleton from "../ui/reusables/section-loader";
import { constructClassName, constructLevel } from "@/lib/helpers/helper";

const SubjectClasses = () => {
  const [openModal, setOpenModal] = useState(false);
  const { subjectId } = useParams();

  const { subjectClassesData, isLoadingSubjectClasses, refetchSubjectClasses } =
    useSubjectClasses();

  const { classesData, isLoadingClasses } = useClasses();

  if (isLoadingSubjectClasses || isLoadingClasses) return <SectionSkeleton />;

  const subjectClasses: SubjectClassType[] =
    subjectClassesData?.data?.classSubjects;
  const classes: ClassType[] = classesData?.data?.classes;

  const handleOpen = () => setOpenModal(true);
  return (
    <Cols>
      <TableOverflow>
        <Row className="justify-between gap-4 mb-5">
          <h1 className="font-black md:text-xl">Class subjects</h1>
          <div>
            <CustomButton onClick={handleOpen}>+ Add Class</CustomButton>
          </div>
        </Row>

        {!subjectClasses?.length ? (
          <Cols className="items-center gap-2">
            <Empty
              title="No Classes"
              description="No classes offer this subject yet"
            />
            <div>
              <CustomButton onClick={handleOpen}>+ Add Class</CustomButton>
            </div>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Td>Level</Td>
                <Td>Class</Td>
                <Td>Sub Class (arm)</Td>
                <Td>Status</Td>
              </Tr>
            </TableHeader>
            <Tbody>
              {subjectClasses.map((cls) => (
                <Tr key={cls._id}>
                  <Td>{constructLevel((cls.classId as ClassType)?.level)}</Td>
                  <Td>
                    {constructClassName(
                      (cls.classId as ClassType)?.name,
                      (cls.classId as ClassType)?.level,
                    )}
                  </Td>
                  <Td>{(cls?.classId as ClassType).arm || "N/A"}</Td>
                  <Td>
                    <ActiveBadge
                      status={
                        (cls?.classId as ClassType)?.isActive
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
        subjectId={subjectId as string}
        refetchStaff={refetchSubjectClasses}
        classes={classes}
      />
    </Cols>
  );
};

export default SubjectClasses;
