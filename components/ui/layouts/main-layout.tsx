"use client";

import { protectedRoutes } from "@/lib/helpers/constants";
import { usePathname } from "next/navigation";
import { DashboardNav, TopNav } from "../dashboard/nav";

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
  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] gap-2 relative h-full w-full">
      <div className="hidden top-0 bottom-0 w-full h-screen lg:flex relative overflow-y-auto shadow">
        <DashboardNav />
      </div>
      <div className="w-full relative">
        <TopNav />

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
