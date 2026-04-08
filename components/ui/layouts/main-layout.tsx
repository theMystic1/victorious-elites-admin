"use client";

import { protectedRoutes } from "@/lib/helpers/constants";
import { usePathname } from "next/navigation";
import { DashboardNav, NavItems, TopNav } from "../dashboard/nav";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const pathnameIsChangePwd = pathname === "/changePassword";
  const isProtectedRoute = protectedRoutes.includes(pathname);
  return (
    <main
      className={`min-h-screen w-screen   ${isProtectedRoute && !pathnameIsChangePwd ? "w-full" : "lg:p-8 p-5 m-auto  xl:max-w-340"} relative`}
    >
      {isProtectedRoute && !pathnameIsChangePwd ? (
        <ProtectedDashboardWrapper>{children}</ProtectedDashboardWrapper>
      ) : (
        <div className="h-full">{children}</div>
      )}
    </main>
  );
};

export default MainLayout;

const ProtectedDashboardWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((op) => !op);
  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] gap-2 relative h-full w-full">
      <div className="hidden top-0 bottom-0 w-full h-screen lg:flex relative overflow-y-auto shadow">
        <DashboardNav />
      </div>
      <div className="w-full relative">
        <TopNav openModal={open} onOpenModal={handleOpen} />
        <div
          className={`z-50 bg-white lg:hidden fixed top-0 bottom-0 transition-all duration-300 w-56 p-3  ${open ? "translate-x-0 left-0" : "-translate-x-1000"}`}
        >
          <button className="lg:hidden z-100" onClick={handleOpen}>
            <CgClose size={20} className="font-black" />
          </button>
          <NavItems onOpenModal={handleOpen} />
        </div>

        <div className="md:p-5 p-2">{children}</div>
      </div>
    </div>
  );
};
