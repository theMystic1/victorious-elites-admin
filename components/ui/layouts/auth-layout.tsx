"use client";

import { usePathname } from "next/navigation";
import Logo from "../reusables/logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const title = pathname.includes("login")
    ? "Login Admin / Staff"
    : pathname.includes("forgot")
      ? "Enter your account  email "
      : pathname.includes("otp")
        ? "Verify Email"
        : "Reset Password";
  return (
    <main className="h-full w-full flex items-center justify-center  p-4 lg:p-8 md:m-auto">
      <div className="card w-full md:max-w-160">
        <div className="w-full flex flex-col gap-6 items-center justify-center mb-8">
          <Logo size="lg" />

          <h1 className="font-black text-xl text-center">{title}</h1>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
