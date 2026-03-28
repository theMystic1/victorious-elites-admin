"use client";

import { LuUser, LuUsers } from "react-icons/lu";
import Card from "../ui/reusables/card";
import { FaAddressCard } from "react-icons/fa6";
import { VscTerminalUbuntu } from "react-icons/vsc";
import { METype } from "@/utils/types";
import {
  Table,
  TableHeader,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Tr,
} from "../ui/reusables/table";
import Modal from "../ui/modal";
import { useState } from "react";
import Staffs from "../staffs/staffs";
import { useDashboard } from "@/hooks/useDashboard";
import AdminDashboardSkeleton from "@/app/loading";

const dummydata = [
  {
    name: "Total Students",
    value: 20,
    icon: LuUsers,
    color: "bg-blue-100",
  },
  {
    name: "Total Staffs",
    value: 10,
    icon: LuUser,
    color: "bg-green-100",
  },

  {
    name: "Current session",
    value: "2025/2026",
    icon: FaAddressCard,
    color: "bg-yellow-100",
  },
  {
    name: "Current term",
    value: "First Term",
    icon: VscTerminalUbuntu,
    color: "bg-purple-100",
  },
];

const Overview = () => {
  const [open, setOpen] = useState(false);

  const { dashboardStats, isLoadingStats } = useDashboard();

  if (isLoadingStats) return <AdminDashboardSkeleton />;

  const cards = dashboardStats?.data?.cards;
  // console.log(cards);
  return (
    <div className="flex flex-col gap-6">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={"New Student"}
        description="Enter new student details"
      >
        <div className="h-200 w-200"></div>
      </Modal>
      {/*CARD SESSION*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummydata.map((item, index) => (
          <Card key={index}>
            <div>
              <div
                className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                <item.icon className="" size={20} />
              </div>
              <p className="mt-2 text-sm font-bold">{item.name}</p>
              <p className="text-lg font-bold">
                {item.name === "Total Students"
                  ? (cards?.totalStudents ?? 0)
                  : item.name === "Total Staffs"
                    ? (cards?.totalStaffs ?? 0)
                    : item.name === "Current session"
                      ? cards?.currentSession?.label || "N/A"
                      : item.name === "Current term"
                        ? cards?.currentTerm
                          ? `${cards?.currentTerm?.label} Term`
                          : "N/A"
                        : item.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/*STAFFS TABLE*/}
      <Staffs page="overview" />
    </div>
  );
};

export default Overview;
