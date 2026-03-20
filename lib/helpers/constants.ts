import { IoSchoolOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuSettings, LuUser, LuUsers } from "react-icons/lu";
import { PiCertificateBold } from "react-icons/pi";
import { RxResume } from "react-icons/rx";

export const publicRoutes = [
  "/login",
  "/forgot-password",
  "/otp",
  "/reset-password",
];

export const protectedRoutes = [
  "/",
  "/students",
  "/dashboard",
  "/staffs",
  "/school",
  "/school/class",
  "/results",
];

export const navItems = [
  { label: "Overview", href: "/", ICON: LuLayoutDashboard },
  { label: "Students", href: "/students", ICON: LuUsers },
  { label: "Staffs", href: "/staffs", ICON: LuUser },
  { label: "School", href: "/school", ICON: IoSchoolOutline },
  { label: "Results", href: "/results", ICON: PiCertificateBold },
];
