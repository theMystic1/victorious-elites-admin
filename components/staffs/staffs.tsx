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
import { METype } from "@/utils/types";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import { useState } from "react";
import StaffsModal from "./staffs-modal";
import { DeleteConfirmModal } from "../students/students-modal";
import { deleteStaff } from "@/lib/api/endpoints/auth";
import useMe from "@/hooks/useMe";
import AdminDashboardSkeleton from "@/app/loading";
import Empty from "../ui/reusables/empty";
import { useRouter } from "next/navigation";
import Pagination from "../ui/reusables/pagination";

const Staffs = ({ page }: { page: "staff" | "overview" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editStaff, setEditStaff] = useState<METype | null>(null);

  const { staffsData, isLoadingStaff, refetchStaffs } = useStaffs();
  const { me, isLoadingMe } = useMe();

  const router = useRouter();

  if (isLoadingStaff || isLoadingMe) return <AdminDashboardSkeleton />;
  // if (!staffsData) return <div>No staffs found.</div>;

  const staffs: METype[] = staffsData?.data?.staffs;
  const curUser: METype = me?.user;

  // console.log(staffsData);

  return (
    <div>
      <TableOverflow>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">Staffs Table</h1>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (page === "staff") setOpen(true);
                else router.push("/staffs");
              }}
            >
              {page === "staff" ? "   + New Staff" : "View All"}
            </button>
          </div>
        </div>

        {!staffs?.length ? (
          <Empty
            title="No staffs found"
            description="No staffs found on your database."
          />
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th>Name</Th>
                <Th className="text-[0px] md:text-sm">Email</Th>
                <Th className="text-[0px] md:text-sm">Phone Number</Th>
                <Th>Role</Th>

                {page === "staff" ? <Th>Actions</Th> : null}
              </Tr>
            </TableHeader>
            <Tbody>
              {staffs.map((staff, index) => (
                <Tr key={staff._id}>
                  <Td>
                    {staff.firstName} {staff.lastName}{" "}
                    {staff._id === curUser?._id && (
                      <span className="text-sm text-gray-500">(You)</span>
                    )}
                  </Td>
                  <Td className="text-[0px] md:text-sm">{staff?.email}</Td>
                  <Td className="text-[0px] md:text-sm">
                    {staff?.phoneNumber ?? "_____"}
                  </Td>
                  <Td>{staff.role}</Td>
                  {page === "staff" ? (
                    <Td>
                      {/*<div>
                      <button className="btn">

                      </button>
                    </div>*/}

                      <RowActionsMenuPortal
                        actions={[
                          // {
                          //   label: "View",
                          //   onClick: () => router.push(`/students/${student._id}`),
                          // },
                          {
                            label: "Edit",
                            onClick: () => {
                              setIsEditing(true);
                              setEditStaff(staff);
                            },
                            disabled: staff._id === curUser?._id,
                          },
                          {
                            label: "Delete",
                            onClick: () => {
                              setOpenDelete(true);
                              setEditStaff(staff);
                            },
                            disabled: staff._id === curUser?._id,
                          },
                        ]}
                      />
                    </Td>
                  ) : null}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <Pagination
          paramName="page"
          limitParamName="limit"
          meta={staffsData?.pagination}
          className="mt-8"
        />

        <StaffsModal
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
        />
      </TableOverflow>
    </div>
  );
};

export default Staffs;
