"use client";

import { navItems } from "@/lib/helpers/constants";
import Logo from "../reusables/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { METype } from "@/utils/types";
import { Cols, Row } from "../reusables/cols-rows";
import { getInitials } from "@/lib/helpers/helper";
import useMe from "@/hooks/useMe";

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full flex flex-col gap-4 sticky inset-0 py-8 px-3">
      <div className="flex flex-col items-center gap-0 lg:mb-12">
        <Logo size="md" />
        <h2 className="text-xl font-black">Victorious Elites</h2>
      </div>

      {navItems.map((nav) => (
        <Link
          href={nav.href}
          key={nav.label}
          className={`${pathname?.replace("/class", "") === nav.href ? "bg-black text-white" : "hover:bg-gray-100 hover:text-black transition-all duration-300"} py-2 px-4 rounded-lg flex items-center gap-2`}
        >
          <nav.ICON className="w-5 h-5" />
          <span className="flex items-center gap-2"> {nav.label}</span>
        </Link>
      ))}
    </aside>
  );
};

export const TopNav = () => {
  const { me } = useMe();

  return (
    <nav className="w-full flex items-center justify-between py-4 px-3 sticky inset-x-0 top-0 bg-white z-10 border-b border-b-gray-300 h-24">
      <div className="flex items-center justify-between gap-4 w-full px-5">
        <h2 className="text-2xl font-bold">Welcome, Victorious </h2>

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
        <h1 className="text-xl font-bold">{fullName}</h1>
        <span>{fullName}</span>
      </Cols>
    </div>
  );
};
