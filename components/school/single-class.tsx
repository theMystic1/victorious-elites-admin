"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTerms } from "@/hooks/useTerms";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import { ActiveBadge, ToggleBtn } from "./single-session";
import { ClassType, SessionType, TermType } from "@/utils/types";
import {
  constructClassName,
  constructLevel,
  formatDate,
} from "@/lib/helpers/helper";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { CustomButton } from "../ui/reusables/custom-btn";
import { useState } from "react";
import TermModal from "./term-modal";
import { useClass } from "@/hooks/useClasses";
import { BackBtn, Box, BoxItemRow } from "../students/single-student";
import Modal from "../ui/modal";
import toast from "react-hot-toast";
import { updateClass } from "@/lib/api/endpoints/school";
import { toApiError } from "@/utils/api-error";
import ClassStudents from "./class-students";
import ClassSubjects from "./class-subjects";
import SectionSkeleton from "../ui/reusables/section-loader";

const SingleClass = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermType | undefined>(
    undefined,
  );
  const [isActivating, setIsActivating] = useState(false);

  const { classData, isLoadingClass, refetchClass } = useClass();

  const handleStatusChange = () => {
    setOpen(true);
  };

  if (isLoadingClass) return <SectionSkeleton />;

  const classDetails: ClassType = classData?.data?.class;
  // if () return <div>No terms found</div>;

  const handleActivate = async () => {
    toast.loading("Activating session...");
    setIsActivating(true);
    try {
      await updateClass(classDetails._id!, { ...classDetails, isActive: true });
      await refetchClass();
      toast.remove();
      toast.success("Session activated successfully");

      setOpen(false);
    } catch (error: unknown) {
      const { message } = toApiError(error);

      toast.remove();
      toast.error(message ?? "Failed to activate session");

      console.error(error);
    } finally {
      setIsActivating(false);
    }
  };

  // console.log(classDetails);

  return (
    <Cols className="gap-4">
      <BackBtn />
      <Cols className="gap-4 mt-4">
        <h1 className="font-black text-xl">Class Details</h1>
        <Box className="min-h-50!">
          <BoxItemRow
            title="Level"
            answer={
              // classDetails?.level === "KG"
              //   ? "KINDERGARTEN"
              //   : classDetails?.level === "JS"
              //     ? "JUNIOR SECONDARY"
              //     : classDetails?.level === "SS"
              //       ? "SENIOR SECONDARY"
              //       : classDetails?.level
              constructLevel(classDetails?.level)
            }
          />
          <BoxItemRow
            title="Class"
            answer={
              // classDetails?.level === "PRIMARY" &&
              // classDetails?.name?.includes("P")
              //   ? `Primary ${classDetails?.name?.split("")[1]}`
              //   : classDetails?.name
              constructClassName(classDetails?.name, classDetails?.level)
            }
          />
          <BoxItemRow
            title="Sub class (arm)"
            answer={classDetails?.arm || "N/A"}
          />
          <BoxItemRow
            title="Status"
            answer={
              <ActiveBadge
                status={classDetails?.isActive ? "Active" : "Inactive"}
              />
            }
          />
          {classDetails?.isActive ? null : (
            <BoxItemRow
              title="Activate Session"
              answer={
                <ToggleBtn
                  firstLabel="Inactive"
                  lastLabel="Active"
                  disabled={classDetails?.isActive}
                  selected={classDetails?.isActive ? "Active" : "Inactive"}
                  onSelect={handleStatusChange}
                />
              }
            />
          )}

          <Modal open={open} onClose={() => setOpen(false)}>
            <Cols className="gap-3">
              <h2 className="font-black text-xl">Activate Session</h2>
              <p className="text-gray-500">
                Activating this session, will deactivate and end the previous
                session. Are sure?
              </p>
              <Row className="gap-2 italic justify-between">
                <CustomButton
                  onClick={() => setOpen(false)}
                  variant="secondary"
                  disabled={isActivating}
                >
                  Cancel
                </CustomButton>
                <CustomButton onClick={handleActivate} disabled={isActivating}>
                  {isActivating ? "Activating..." : "Activate"}
                </CustomButton>
              </Row>
            </Cols>
          </Modal>
        </Box>
      </Cols>

      <ClassStudents curClass={classDetails} />

      <ClassSubjects />
    </Cols>
  );
};

export default SingleClass;
