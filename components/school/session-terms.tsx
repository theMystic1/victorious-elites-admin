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
import { ActiveBadge } from "./single-session";
import { SessionType, TermType } from "@/utils/types";
import { formatDate } from "@/lib/helpers/helper";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import { Cols } from "../ui/reusables/cols-rows";
import { CustomButton } from "../ui/reusables/custom-btn";
import { useState } from "react";
import TermModal from "./term-modal";
import Empty from "../ui/reusables/empty";
import SectionSkeleton from "../ui/reusables/section-loader";

const SessionTerms = ({ session }: { session: SessionType }) => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<TermType | undefined>(
    undefined,
  );

  const { termsData, isLoadingTerm, refetchTerms } = useTerms();

  if (isLoadingTerm) return <SectionSkeleton />;

  const terms: TermType[] = termsData.data?.terms;
  // if () return <div>No terms found</div>;

  // const lastTerm = terms[terms?.length - 1]?.term;

  return (
    <Cols className="gap-4 mt-10">
      <h1 className="font-black text-xl">Session Terms</h1>
      <TableOverflow>
        {terms[terms?.length - 1]?.term === "Third" || !terms?.length ? null : (
          <div className="flex justify-end items-center">
            <CustomButton
              className="max-w-50 mb-6"
              onClick={() => setOpen(true)}
            >
              + Add{" "}
              {terms?.length === 0
                ? "First"
                : terms?.length === 1
                  ? "Second"
                  : "Third"}{" "}
              Term
            </CustomButton>
          </div>
        )}
        {!terms?.length ? (
          <Cols>
            <Empty
              title=" No Terms found"
              description="No Terms found for this session."
            />
            <div className="flex justify-center items-center">
              <CustomButton
                className="max-w-50 mb-6"
                onClick={() => setOpen(true)}
              >
                + Add{" "}
                {terms?.length === 0
                  ? "First"
                  : terms?.length === 1
                    ? "Second"
                    : "Third"}{" "}
                Term
              </CustomButton>
            </div>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th>Term</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Term Status</Th>
                <Th>Actions</Th>
              </Tr>
            </TableHeader>
            <Tbody>
              {terms.map((term, index) => (
                <Tr key={term._id}>
                  <Td>{term?.term} Term</Td>
                  <Td>{formatDate(term?.startDate)}</Td>
                  <Td>
                    {term?.endDate ? formatDate(term?.endDate) : "Not set"}
                  </Td>
                  <Td>
                    <ActiveBadge
                      status={term?.isActive ? "Active" : "Inactive"}
                    />
                  </Td>
                  <Td>
                    <RowActionsMenuPortal
                      actions={[
                        // {
                        //   label: "View",
                        //   onClick: () => router.push(`/school/${term._id}`),
                        // },
                        {
                          label: "Edit",
                          onClick: () => {
                            setIsEdit(true);
                            setSelectedTerm(term as TermType);
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
      </TableOverflow>
      <TermModal
        open={open || isEdit}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
          setSelectedTerm(undefined);
        }}
        refetchStaff={refetchTerms}
        curSession={session}
        isEdit={isEdit}
        lastTerm={isEdit ? selectedTerm?.term : terms[terms?.length - 1]?.term}
        editTerm={selectedTerm as TermType}
      />
    </Cols>
  );
};

export default SessionTerms;
