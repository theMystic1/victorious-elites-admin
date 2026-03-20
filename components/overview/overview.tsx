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

const dummyStaffs: METype[] = [
  {
    email: "nnamezie@mail.ru",
    firstName: "Chukwunonso",
    lastName: "Nnamezie",
    role: "STAFF",
    gender: "MALE",
  },
  {
    email: "chukwunonso@mail.ru",
    firstName: "Mary",
    lastName: "Reginald",
    role: "STAFF",
    gender: "FEMALE",
  },
  {
    email: "cally@mail.ru",
    firstName: "Cally",
    lastName: "Joshua",
    role: "STAFF",
    gender: "MALE",
  },
  {
    email: "staff@mail.ru",
    firstName: "Staff",
    lastName: "Kinky",
    role: "STAFF",
    gender: "MALE",
  },
  {
    email: "jinky@mail.ru",
    firstName: "Jinky",
    lastName: "Reginald",
    role: "STAFF",
    gender: "FEMALE",
  },
];

const Overview = () => {
  const [open, setOpen] = useState(false);

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
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/*STAFFS TABLE*/}
      <TableOverflow>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black">Staffs Table</h1>
          <div>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              View All
            </button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Gender</Th>
            </Tr>
          </TableHeader>
          <Tbody>
            {dummyStaffs.map((staff, index) => (
              <Tr key={index}>
                <Td>
                  {staff.firstName} {staff.lastName}
                </Td>
                <Td>{staff.email}</Td>
                <Td>{staff.role}</Td>
                <Td>{staff.gender}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableOverflow>
    </div>
  );
};

export default Overview;
