"use client";

import { useSingleStudent } from "@/hooks/useStudents";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { BackBtn, Box } from "../students/single-student";
import StudentsInfo from "../students/studentsInfo";
import ResultCompute from "./result-compute";
import { ClassType, StudentsType } from "@/utils/types";
import AdminDashboardSkeleton from "@/app/loading";

const ComputeResult = () => {
  const { studentData, isLoadingStudent, refetchStudent } = useSingleStudent();

  const singleStudent: StudentsType = studentData?.data?.student;

  // console.log(singleStudent);

  if (isLoadingStudent) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <Cols className="gap-6">
      <Row className="w-full justify-between!">
        <div>
          <BackBtn
            pathname={`/results?classId=${(singleStudent?.curClassId as ClassType)?._id}`}
          />
        </div>
        <div></div>
      </Row>
      <StudentsInfo singleStudent={singleStudent} type="result" />
      <ResultCompute
        classId={(singleStudent?.curClassId as ClassType)?._id!}
        level={(singleStudent?.curClassId as ClassType)?.level!}
      />
    </Cols>
  );
};

export default ComputeResult;
