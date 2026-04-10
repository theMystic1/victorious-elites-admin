"use client";

import { navItems } from "@/lib/helpers/constants";
import Logo from "../reusables/logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { METype } from "@/utils/types";
import { Cols, Row } from "../reusables/cols-rows";
import { getInitials } from "@/lib/helpers/helper";
import useMe from "@/hooks/useMe";
import { CustomButton } from "../reusables/custom-btn";
import { GrLogout } from "react-icons/gr";
import { removeCookie } from "@/lib/helpers/helper";
import { useQueryClient } from "@tanstack/react-query";
import { BiMenu } from "react-icons/bi";

export const DashboardNav = () => {
  return (
    <aside className="w-full flex flex-col gap-4 fixed left-0 top-0 bottom-0  py-8 px-3">
      <NavItems />
    </aside>
  );
};

export const NavItems = ({ onOpenModal }: { onOpenModal?: () => void }) => {
  const pathname = usePathname();
  const qc = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    removeCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN!);

    router.push("/login");
    qc.clear();
  };

  return (
    <Cols className="justify-between h-full">
      <Cols className="gap-4">
        <div className="flex flex-col items-center gap-0 lg:mb-12 sticky  max-w-56">
          <Logo size="md" />
          <h2 className="text-xl font-black">Victorious Elites</h2>
        </div>

        {navItems.map((nav) => (
          <Link
            href={nav.href}
            key={nav.label}
            className={`${pathname?.replace("/class", "") === nav.href || pathname?.replace("/subject", "") === nav.href ? "bg-black text-white" : "hover:bg-gray-100 hover:text-black transition-all duration-300"} py-2 px-4 rounded-lg flex items-center max-w-54 gap-2`}
            onClick={onOpenModal}
          >
            <nav.ICON className="w-5 h-5" />
            <span className="flex items-center gap-2"> {nav.label}</span>
          </Link>
        ))}
      </Cols>

      <CustomButton
        variant="danger"
        className="w-40  mb-20 lg:mb-0 flex items-center gap-2"
        onClick={handleLogout}
      >
        <GrLogout />
        <span>Logout</span>
      </CustomButton>
    </Cols>
  );
};

export const TopNav = ({
  openModal,
  onOpenModal,
}: {
  openModal: boolean;
  onOpenModal: () => void;
}) => {
  const { me } = useMe();

  return (
    <nav className="w-full flex items-center justify-between py-4 lg:px-3 sticky inset-x-0 top-0 bg-white z-10 border-b border-b-gray-300 h-24">
      <div className="flex items-center justify-between gap-4 w-full px-5">
        <Row className="gap-2">
          <button className="lg:hidden z-[100]" onClick={onOpenModal}>
            <BiMenu size={20} className="font-black" />
          </button>
          <h2 className="lg:text-2xl font-bold">Welcome, Victorious </h2>
        </Row>

        {me && <UserInfo user={me?.user} />}
      </div>
    </nav>
  );
};

const UserInfo = ({ user }: { user: METype }) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full h-8 w-8 border border-gold-700 text-gold-700 font-black text-center flex items-center justify-center">
        {getInitials(fullName)}
      </span>
      <Cols className="">
        <h1 className="lg:text-xl text-sm font-bold">{fullName}</h1>
        <span className="hidden md:flex">{fullName}</span>
      </Cols>
    </div>
  );
};
