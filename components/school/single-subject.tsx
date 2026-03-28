"use client";

import { useSubject } from "@/hooks/useSubjects";
import { SubjectType } from "@/utils/types";
import { useParams } from "next/navigation";
import { BackBtn, Box, BoxItemRow } from "../students/single-student";
import { Cols } from "../ui/reusables/cols-rows";
import { ActiveBadge } from "./single-session";
import SubjectClasses from "./subject-classes";
import AdminDashboardSkeleton from "@/app/loading";

const SingleSubject = () => {
  const { subjectData, refetchSubject, isLoadingSubject } = useSubject();

  if (isLoadingSubject) return <AdminDashboardSkeleton />;

  // console.log(subjectClassesData);

  const subject: SubjectType = subjectData?.data?.subject;
  return (
    <Cols className="gap-5">
      <BackBtn />
      <h1 className="font-black text-xl">Subject Information</h1>
      <Box className="min-h-44!">
        <BoxItemRow title="Name" answer={subject.name} />
        <BoxItemRow title="Code" answer={subject.code} />
        <BoxItemRow
          title="Status"
          answer={
            <ActiveBadge status={subject.isActive ? "Active" : "Inactive"} />
          }
        />
      </Box>

      <SubjectClasses />
    </Cols>
  );
};

export default SingleSubject;
