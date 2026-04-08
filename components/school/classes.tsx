"use client";

import { useClasses } from "@/hooks/useClasses";
import { ClassType, SessionType } from "@/utils/types";
import { Cols, Row } from "../ui/reusables/cols-rows";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import RowActionsMenuPortal from "../ui/reusables/table-menu";
import { ActiveBadge } from "./single-session";
import { useState } from "react";
import InputContainer from "../ui/reusables/input-container";
import SearchableNativeSelect from "../ui/reusables/select";
import { classLevels } from "@/lib/helpers/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ClassesModal from "./classes-modal";
import Empty from "../ui/reusables/empty";
import { useSession } from "@/hooks/useSession";
import Pagination from "../ui/reusables/pagination";
import SectionSkeleton from "../ui/reusables/section-loader";
import { constructLevel } from "@/lib/helpers/helper";

const Classes = () => {
  const searchParams = useSearchParams();
  const classLevel = searchParams.get("classLevel");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(classLevel ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [editClass, setEditClass] = useState<ClassType | undefined>(undefined);

  const { sessionData, isLoadingSession } = useSession();
  const { classesData, isLoadingClasses, refetchClasses } = useClasses();

  const updateQueryParams = (level: string) => {
    const next = new URLSearchParams(searchParams.toString());

    if (!level) {
      next.delete("classLevel");
    } else {
      next.set("classLevel", level);
    }

    router.push(`${pathname}?${next.toString()}`);
  };

  if (isLoadingClasses || isLoadingSession)
    return <SectionSkeleton className="mt-8" />;
  if (!classesData) return <div>No classes found.</div>;
  const fetchedSessions: SessionType[] = sessionData?.data?.sessions ?? [];
  const curSessionId = fetchedSessions?.find((ses) => ses?.isActive)?._id;
  const classes: ClassType[] = classesData?.data?.classes;

  // console.log(classes);
  return (
    <Cols className="mt-4">
      <h1 className="text-xl font-black">Class Table</h1>
      <TableOverflow className="mt-6">
        <div className="flex items-center justify-between mb-4 ">
          <Row className=" flex-col! lg:flex-row items-start lg:items-center gap-2">
            <h3 className="font-black md:text-nowrap">Filter by Level</h3>
            <InputContainer className="max-w-50">
              <SearchableNativeSelect
                options={[
                  {
                    label: "All Classes",
                    value: "",
                  },
                  ...classLevels,
                ]}
                value={selectedClass}
                onChange={(value) => {
                  setSelectedClass(value);
                  updateQueryParams(value);
                }}
                placeholder="Select class level"
                // className="input"
              />
            </InputContainer>
          </Row>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              + New Class
            </button>
          </div>
        </div>
        {!classes?.length ? (
          <Cols className="items-center gap-3">
            <Empty
              title="No Classes found"
              description="No classes found on your database."
            />
            <Cols className="max-w-50">
              <button className="btn btn-primary" onClick={() => setOpen(true)}>
                + New Class
              </button>
            </Cols>
          </Cols>
        ) : (
          <Table>
            <TableHeader>
              <Tr>
                <Th className="text-sm">Level</Th>
                <Th className="text-sm">Class</Th>
                <Th className="text-sm ">Sub Class</Th>
                <Th className="hidden md:flex">Class Status</Th>
                <Th className="text-sm">Actions</Th>
              </Tr>
            </TableHeader>
            <Tbody>
              {classes.map((cls, index) => (
                <Tr key={cls._id}>
                  <Td className="text-xs lg:text-sm">
                    {/*{cls?.level === "KG"
                      ? "NURSERY"
                      : cls?.level === "JS"
                        ? "JUNIOR SECONDARY"
                        : cls?.level === "SS"
                          ? "SENIOR SECONDARY"
                          : cls?.level === "PRIMARY"
                            ? "BASIC"
                            : cls.level}*/}

                    {constructLevel(cls?.level)}
                  </Td>
                  <Td className="text-xs lg:text-sm">
                    {constructLevel(cls?.level)}
                  </Td>
                  <Td className="text-xs lg:text-sm">
                    {!cls?.arm || cls?.arm === "" ? "N/A" : cls?.arm}
                  </Td>
                  <Td className="text-[0px]! hidden md:flex">
                    <ActiveBadge
                      status={cls?.isActive ? "Active" : "Inactive"}
                    />
                  </Td>
                  <Td>
                    <RowActionsMenuPortal
                      actions={[
                        {
                          label: "View",
                          onClick: () =>
                            router.push(
                              `/school/class/${cls?._id}?sessionId=${curSessionId}`,
                            ),
                        },
                        {
                          label: "Edit",
                          onClick: () => {
                            setIsEditing(true);
                            setEditClass(cls);
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
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <Pagination
          paramName="page"
          limitParamName="limit"
          meta={classesData?.pagination}
          className="mt-8"
        />
      </TableOverflow>

      <ClassesModal
        open={open || isEditing}
        onClose={() => {
          setOpen(false);
          setIsEditing(false);
          setEditClass(undefined);
        }}
        refetchStaff={refetchClasses}
        editClass={editClass}
        isEdit={isEditing}
      />
    </Cols>
  );
};

export default Classes;
