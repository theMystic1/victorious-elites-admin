"use client";

import { useClasses } from "@/hooks/useClasses";
import { useClassResults } from "@/hooks/useClassResults";
import { useSession } from "@/hooks/useSession";
import { useTerms } from "@/hooks/useTerms";
import type { ClassType, SessionType, TermType } from "@/utils/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Cols } from "../ui/reusables/cols-rows";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import InputContainer from "../ui/reusables/input-container";
import SearchableNativeSelect from "../ui/reusables/select";
import Empty from "../ui/reusables/empty";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import { constructClassName, toOrdinal } from "@/lib/helpers/helper";

const ResultsTable = ({
  fetchedClasses,
  leaderBoard,
  selectedClassId,
  selectedSessionId,
  selectedTermId,
  setSelectedClassId,
  updateQueryParams,
  setSelectedClassTermId,
  setSelectedSessionId,
}: {
  fetchedClasses: ClassType[];
  leaderBoard: any[];
  setSelectedClassId: Dispatch<SetStateAction<string>>;
  setSelectedSessionId: Dispatch<SetStateAction<string>>;
  setSelectedClassTermId: Dispatch<SetStateAction<string>>;
  selectedClassId: string;
  selectedSessionId: string;
  selectedTermId: string;
  updateQueryParams: (id: string, value: string) => void;
}) => {
  const router = useRouter();

  // console.log(leaderBoard);

  return (
    <Cols>
      {/* Render your table here */}
      <div>ResultsTable</div>

      <TableOverflow>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">Student's Result table</h1>
          <div className="flex items-center gap-2">
            <InputContainer>
              <SearchableNativeSelect
                options={fetchedClasses.map((cls) => ({
                  value: cls._id!,
                  label: constructClassName(cls.name, cls.level),
                  disabled: !cls.isActive,
                }))}
                value={selectedClassId}
                onChange={(value) => {
                  setSelectedClassId(value);
                  updateQueryParams("classId", value);
                }}
                placeholder="Select student class"
                // className="input"
              />
            </InputContainer>
          </div>
        </div>
        {!leaderBoard?.length ? (
          <Empty
            title="No students found"
            description="No students found on your database."
          />
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th className="text-xs mr-1">Reg No.</Th>
                <Th className="text-xs mr-1">Name</Th>
                <Th className="text-xs mr-1">Average</Th>
                <Th className="text-xs mr-1">Score</Th>
                <Th className="text-xs mr-1">Position</Th>
                {/*
                <Th>Gender</Th>*/}
                <Th>Actions</Th>
              </Tr>
            </TableHeader>
            <Tbody>
              {leaderBoard.map((result: any, index: number) => (
                <Tr key={index}>
                  <Td>{result.studentsId}</Td>
                  <Td>{result.fullName}</Td>
                  <Td>{result?.overallAverage ?? "0"} </Td>
                  <Td>{result?.overallTotal ?? "0"} </Td>
                  <Td>
                    {!result?.overallTotal
                      ? "N/A"
                      : toOrdinal(result?.pos)}{" "}
                  </Td>
                  {/*
                   */}

                  <Td>
                    {/*<div>
                    <button className="btn">

                    </button>
                  </div>*/}

                    <RowActionsMenuPortal
                      actions={[
                        {
                          label: "View Student",
                          onClick: () => {
                            router.push(`/results/${result.studentId}`);
                          },
                        },
                        {
                          label: "Compute result",
                          onClick: () => {
                            router.push(`/results/${result.studentId}/compute`);
                            if (selectedSessionId) {
                              sessionStorage.clear();
                              sessionStorage.setItem(
                                "sessionId",
                                selectedSessionId ?? "",
                              );
                            }
                          },
                        },
                      ]}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableOverflow>
    </Cols>
  );
};

export default ResultsTable;
