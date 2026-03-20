"use client";

import { useStaffs } from "@/hooks/useStaffs";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import { METype, SessionType } from "@/utils/types";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import { useState } from "react";

import { DeleteConfirmModal } from "../students/students-modal";
import { deleteStaff } from "@/lib/api/endpoints/auth";
import useMe from "@/hooks/useMe";
import AdminDashboardSkeleton from "@/app/loading";
import { useSession } from "@/hooks/useSession";
import { formatDate } from "@/lib/helpers/helper";
import SessionModal from "./school-modal";
import { CustomButton } from "../ui/reusables/custom-btn";
import { useRouter } from "next/navigation";
import { ActiveBadge } from "./single-session";

const Sessions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editStaff, setEditStaff] = useState<SessionType | null>(null);
  const router = useRouter();

  const { sessionData, isLoadingSession, refetchSession } = useSession();
  const { me, isLoadingMe } = useMe();

  if (isLoadingSession || isLoadingMe) return <AdminDashboardSkeleton />;
  if (!sessionData) return <div>No sessions found.</div>;

  const sessions: SessionType[] = sessionData?.data?.sessions;

  return (
    <div>
      <TableOverflow className="mt-6">
        <div className="flex items-center justify-between mb-4 ">
          <h1 className="text-xl font-black">Sessions Table</h1>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              + New Session
            </button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <Tr>
              <Th>Session</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Session Status</Th>
              <Th>Actions</Th>
            </Tr>
          </TableHeader>
          <Tbody>
            {sessions.map((session, index) => (
              <Tr key={session._id}>
                <Td>{session?.session}</Td>
                <Td>{formatDate(session?.startDate)}</Td>
                <Td>{formatDate(session?.endDate)}</Td>
                <Td>
                  <ActiveBadge
                    status={session?.isActive ? "Active" : "Inactive"}
                  />
                </Td>
                <Td>
                  <RowActionsMenuPortal
                    actions={[
                      {
                        label: "View",
                        onClick: () => router.push(`/school/${session._id}`),
                      },
                      {
                        label: "Edit",
                        onClick: () => {
                          setIsEditing(true);
                          setEditStaff(session);
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

                  {/*<div className="max-w-20">
                    <CustomButton
                      onClick={() => {
                        setIsEditing(true);
                        setEditStaff(session);
                      }}
                      variant="secondary"
                    >
                      Edit
                    </CustomButton>
                  </div>*/}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <SessionModal
          open={open || isEditing}
          onClose={() => {
            setOpen(false);
            setIsEditing(false);
            setEditStaff(null);
          }}
          isEdit={isEditing}
          editStaff={editStaff!}
          refetchStaff={refetchSession}
        />

        {/*<StaffsModal
          open={open || isEditing}
          onClose={() => {
            setOpen(false);
            setIsEditing(false);
            setEditStaff(null);
          }}
          isEdit={isEditing}
          editStaff={editStaff!}
          refetchStaff={refetchStaffs}
        />

        <DeleteConfirmModal
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setEditStaff(null);
          }}
          item="Staff"
          refetch={refetchStaffs}
          studentId={editStaff?._id as string}
          onDeleteAction={async (id) => {
            await deleteStaff(id);
            refetchStaffs();

            setEditStaff(null);
          }}
        />*/}
      </TableOverflow>
    </div>
  );
};

export default Sessions;
