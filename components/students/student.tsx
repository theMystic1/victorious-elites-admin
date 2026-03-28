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
import Empty from "../ui/reusables/empty";
import StudentsTable from "./students-table";
import SectionSkeleton from "../ui/reusables/section-loader";
import AdminDashboardSkeleton from "@/app/loading";

const Students = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editStudent, setEditStudent] = useState<StudentsType | undefined>(
    undefined,
  );

  const { studentsData, isLoadingStudent, refetchStudents } = useStudents({});
  const { sessionData, isLoadingSession } = useSession();
  const { classesData, isLoadingClasses } = useClasses();

  const isLoading = isLoadingStudent || isLoadingSession || isLoadingClasses;
  if (isLoading) return <AdminDashboardSkeleton />;

  const fetchedClasses: ClassType[] = classesData?.data?.classes ?? [];
  const fetchedSessions: SessionType[] = sessionData?.data?.sessions ?? [];

  // console.log(studentsData);

  return (
    <div className="">
      <StudentsTable
        type="students"
        setOpenDelete={setOpenDelete}
        setIsEdit={setIsEdit}
        setEditStudent={
          setEditStudent as React.Dispatch<React.SetStateAction<StudentsType>>
        }
        setOpen={setOpen}
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

      <StudentsModal
        fetchedClasses={fetchedClasses}
        onClose={() => setOpen(false)}
        fetchedSessions={fetchedSessions}
        open={open}
        refetchStudents={refetchStudents}
      />
    </div>
  );
};

export default Students;
