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
import Empty from "../ui/reusables/empty";
import { Cols } from "../ui/reusables/cols-rows";
import Pagination from "../ui/reusables/pagination";

const Sessions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);
  const [editStaff, setEditStaff] = useState<SessionType | null>(null);
  const router = useRouter();

  const { sessionData, isLoadingSession, refetchSession } = useSession();
  const { me, isLoadingMe } = useMe();

  if (isLoadingSession || isLoadingMe) return <AdminDashboardSkeleton />;
  // if (!sessionData) return <div>No sessions found.</div>;

  const sessions: SessionType[] = sessionData?.data?.sessions;

  const activeSession = sessions?.find((ses) => ses?.isActive);

  console.log(activeSession);

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
        {!sessions?.length ? (
          <Cols className="items-center gap-3">
            <Empty
              title="No sessions found"
              description="No sessions found on your database."
            />
            <Cols className="max-w-50">
              <button className="btn btn-primary" onClick={() => setOpen(true)}>
                + New Session
              </button>
            </Cols>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th className="text-sm">Session</Th>
                <Th className="text-sm">Start Date</Th>
                <Th className="text-sm hidden md:flex">End Date</Th>
                <Th className="text-sm">Session Status</Th>
                <Th className="text-sm">Actions</Th>
              </Tr>
            </TableHeader>
            <Tbody>
              {sessions.map((session, index) => (
                <Tr key={session._id}>
                  <Td className="text-xs  md:text-sm">{session?.session}</Td>
                  <Td className="text-xs md:text-sm">
                    {formatDate(session?.startDate)}
                  </Td>
                  <Td className="text-xs  md:text-sm hidden md:flex">
                    {formatDate(session?.endDate)}
                  </Td>
                  <Td className="text-xs  md:text-sm">
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
        )}

        <Pagination
          paramName="page"
          limitParamName="limit"
          meta={sessionData?.pagination}
          className="mt-8"
        />

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
          curSessionId={activeSession?._id as string}
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
